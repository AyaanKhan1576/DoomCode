/**
 * Module: browserProbe.ts
 * Description: Phase 0 compatibility probe. Lets a tester try each candidate route
 * for opening the TikTok For You page in an editor browser, then record what they
 * observed. Every launch runs only after an explicit user choice.
 */

import * as vscode from 'vscode';
import { FOR_YOU_URL, isAllowedHandoffUrl } from '../constants/urls';
import type { Logger } from '../diagnostics/log';
import {
  filterBrowserCommands,
  formatProbeRecord,
  type ProbeOutcome,
  type ProbeRecord,
  type ProbeRoute,
} from './probeReport';

const PROBE_SESSION_NAME = 'DoomCode Browser Probe';
const EDITOR_BROWSER_DEBUG_TYPE = 'editor-browser';

interface RouteItem extends vscode.QuickPickItem {
  route: ProbeRoute;
}

const ROUTE_ITEMS: readonly RouteItem[] = [
  {
    route: 'inventory',
    label: 'Inventory host capabilities',
    detail: 'Lists browser-related commands and debugger contributions. Opens nothing.',
  },
  {
    route: 'debugLaunch',
    label: 'Route (a): editor-browser debug launch',
    detail: 'Starts an editor-browser launch configuration with the For You URL.',
  },
  {
    route: 'openExternal',
    label: 'Route (b): vscode.env.openExternal',
    detail: 'Uses the host opener. Lands in the integrated browser only if you configured an opener.',
  },
  {
    route: 'commandOpen',
    label: 'Route (c): workbench.action.browser.open (undocumented)',
    detail: 'Probe only. Passes the For You URL as an argument to an undocumented command.',
  },
];

/** Undocumented command observed on VS Code 1.148.0. Never relied on without a release decision. */
const BROWSER_OPEN_COMMAND = 'workbench.action.browser.open';

const OUTCOME_ITEMS: readonly (vscode.QuickPickItem & { outcome: ProbeOutcome })[] = [
  { outcome: 'pass', label: 'Pass', detail: 'For You page opened in the expected surface and played.' },
  { outcome: 'partial', label: 'Partial', detail: 'Opened, but with a problem (placement, playback, sign-in).' },
  { outcome: 'fail', label: 'Fail', detail: 'Nothing usable opened.' },
  { outcome: 'unavailable', label: 'Unavailable', detail: 'Route does not exist on this host.' },
];

/**
 * Checks whether any installed extension contributes a debugger of the given type.
 * Core-provided debuggers may not appear here, so a false result is informational.
 */
function hasDebuggerContribution(type: string): boolean {
  return vscode.extensions.all.some((extension) => {
    const contributes = (extension.packageJSON as { contributes?: { debuggers?: unknown } }).contributes;
    const debuggers = contributes?.debuggers;
    return Array.isArray(debuggers) && debuggers.some((entry) => (entry as { type?: unknown }).type === type);
  });
}

export class BrowserProbe implements vscode.Disposable {
  private probeSession: vscode.DebugSession | undefined;
  private readonly disposables: vscode.Disposable[] = [];

  constructor(private readonly log: Logger) {
    this.disposables.push(
      vscode.debug.onDidStartDebugSession((session) => this.onSessionStarted(session)),
      vscode.debug.onDidTerminateDebugSession((session) => this.onSessionTerminated(session)),
    );
  }

  /**
   * Prompts the tester for a route, runs it, and records the observed outcome.
   */
  async run(): Promise<void> {
    const choice = await vscode.window.showQuickPick(ROUTE_ITEMS, { title: 'DoomCode browser route probe' });
    if (!choice) {
      return;
    }
    try {
      const launchResult = await this.runRoute(choice.route);
      const record: ProbeRecord = {
        hostName: vscode.env.appName,
        hostVersion: vscode.version,
        route: choice.route,
        launchResult,
      };
      if (choice.route !== 'inventory') {
        const observed = await vscode.window.showQuickPick(OUTCOME_ITEMS, {
          title: 'What did you observe?',
          placeHolder: 'The API result alone is not proof the page opened or played.',
        });
        record.observed = observed?.outcome;
      }
      this.log.info(`probe record: ${formatProbeRecord(record)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.log.error(`probe route ${choice.route} threw: ${message}`);
      void vscode.window.showErrorMessage(`DoomCode probe: route ${choice.route} failed. See the DoomCode output.`);
    }
  }

  /**
   * Stops the probe's own debug session, if one is running. Used to test whether
   * stopping the session closes only the DoomCode-launched browser tab.
   */
  async stopSession(): Promise<void> {
    if (!this.probeSession) {
      void vscode.window.showInformationMessage('DoomCode probe: no probe session is running.');
      return;
    }
    this.log.info('debugLaunch: stopDebugging requested for probe session');
    await vscode.debug.stopDebugging(this.probeSession);
  }

  dispose(): void {
    this.disposables.forEach((disposable) => disposable.dispose());
  }

  private async runRoute(route: ProbeRoute): Promise<string> {
    if (!isAllowedHandoffUrl(FOR_YOU_URL)) {
      throw new Error('For You URL failed allowlist validation');
    }
    switch (route) {
      case 'inventory':
        return this.inventory();
      case 'debugLaunch': {
        const started = await vscode.debug.startDebugging(undefined, {
          type: EDITOR_BROWSER_DEBUG_TYPE,
          name: PROBE_SESSION_NAME,
          request: 'launch',
          url: FOR_YOU_URL,
        });
        return `startDebugging returned ${started}`;
      }
      case 'openExternal': {
        const opened = await vscode.env.openExternal(vscode.Uri.parse(FOR_YOU_URL));
        return `openExternal returned ${opened}`;
      }
      case 'commandOpen': {
        const available = (await vscode.commands.getCommands(true)).includes(BROWSER_OPEN_COMMAND);
        if (!available) {
          return 'command absent';
        }
        await vscode.commands.executeCommand(BROWSER_OPEN_COMMAND, FOR_YOU_URL);
        return 'command executed (argument handling unverified)';
      }
    }
  }

  private async inventory(): Promise<string> {
    const browserCommands = filterBrowserCommands(await vscode.commands.getCommands(true));
    const contributed = hasDebuggerContribution(EDITOR_BROWSER_DEBUG_TYPE);
    this.log.info(`inventory: ${browserCommands.length} browser-related commands`);
    browserCommands.forEach((id) => this.log.info(`inventory command: ${id}`));
    this.log.info(`inventory: '${EDITOR_BROWSER_DEBUG_TYPE}' contributed by an extension: ${contributed}`);
    this.log.info(`inventory: workspace trusted: ${vscode.workspace.isTrusted}`);
    return `commands=${browserCommands.length}, editorBrowserContributed=${contributed}`;
  }

  private onSessionStarted(session: vscode.DebugSession): void {
    const root = session.parentSession === undefined;
    if (root && session.name === PROBE_SESSION_NAME) {
      this.probeSession = session;
      this.log.info(`debugLaunch: probe session started (type=${session.type})`);
    } else if (this.probeSession && session.parentSession === this.probeSession) {
      this.log.info(`debugLaunch: child session started (type=${session.type})`);
    }
  }

  private onSessionTerminated(session: vscode.DebugSession): void {
    if (session === this.probeSession) {
      this.probeSession = undefined;
      this.log.info('debugLaunch: probe session terminated');
    }
  }
}

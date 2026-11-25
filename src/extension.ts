/**
 * Module: extension.ts
 * Description: DoomCode activation entry point. Registers commands only; it never
 * opens a browser or mounts a player on activation.
 */

import * as vscode from 'vscode';
import { createLogger } from './diagnostics/log';
import { BrowserProbe } from './spike/browserProbe';

/**
 * Activates DoomCode and registers its commands.
 *
 * @param context - Extension context provided by the host.
 */
export function activate(context: vscode.ExtensionContext): void {
  const log = createLogger(context);
  const probe = new BrowserProbe(log);

  context.subscriptions.push(
    probe,
    vscode.commands.registerCommand('doomcode.spike.probeBrowserRoutes', () => probe.run()),
    vscode.commands.registerCommand('doomcode.spike.stopProbeSession', () => probe.stopSession()),
  );

  log.info(`activated on ${vscode.env.appName} ${vscode.version}`);
}

/**
 * Deactivates DoomCode. Disposables registered on the context are released by the host.
 */
export function deactivate(): void {}

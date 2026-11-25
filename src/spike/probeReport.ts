/**
 * Module: probeReport.ts
 * Description: Host-independent types and formatting for the Phase 0 browser route
 * probe. Kept free of the vscode API so it can be unit tested.
 */

export type ProbeRoute = 'inventory' | 'debugLaunch' | 'openExternal' | 'commandOpen';

export type ProbeOutcome = 'pass' | 'partial' | 'fail' | 'unavailable';

export interface ProbeRecord {
  hostName: string;
  hostVersion: string;
  route: ProbeRoute;
  /** What the API call itself reported. This is not proof of playback. */
  launchResult: string;
  /** What the tester observed in the editor, entered manually. */
  observed?: ProbeOutcome;
}

const BROWSER_COMMAND_PATTERN = /browser/i;

/**
 * Selects command IDs that look browser-related, for manual inspection only.
 * A command being present establishes discoverability, not argument support.
 *
 * @param commandIds - All command IDs reported by the host.
 * @returns Sorted, de-duplicated browser-related command IDs.
 */
export function filterBrowserCommands(commandIds: readonly string[]): string[] {
  return [...new Set(commandIds.filter((id) => BROWSER_COMMAND_PATTERN.test(id)))].sort();
}

/**
 * Formats a probe record as one line for the compatibility matrix.
 *
 * @param record - Probe result to format.
 * @returns Pipe-delimited row matching docs/compatibility.md columns.
 */
export function formatProbeRecord(record: ProbeRecord): string {
  return [
    record.hostName,
    record.hostVersion,
    record.route,
    record.launchResult,
    record.observed ?? 'not recorded',
  ].join(' | ');
}

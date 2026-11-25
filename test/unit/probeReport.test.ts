import { describe, expect, it } from 'vitest';
import { filterBrowserCommands, formatProbeRecord } from '../../src/spike/probeReport';

describe('filterBrowserCommands', () => {
  it('keeps browser-related IDs, sorted and unique', () => {
    const ids = ['workbench.action.browser.open', 'editor.action.format', 'simpleBrowser.show', 'simpleBrowser.show'];
    expect(filterBrowserCommands(ids)).toEqual(['simpleBrowser.show', 'workbench.action.browser.open']);
  });
});

describe('formatProbeRecord', () => {
  it('formats a row and marks missing observations', () => {
    const row = formatProbeRecord({
      hostName: 'Visual Studio Code',
      hostVersion: '1.147.0',
      route: 'debugLaunch',
      launchResult: 'startDebugging returned true',
    });
    expect(row).toBe('Visual Studio Code | 1.147.0 | debugLaunch | startDebugging returned true | not recorded');
  });
});

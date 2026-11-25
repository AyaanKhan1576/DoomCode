/**
 * Module: extension.test.ts
 * Description: Extension Development Host checks for contributions and activation.
 */

import * as assert from 'node:assert';
import * as vscode from 'vscode';

const EXTENSION_ID = 'doomcode-dev.doomcode';

suite('DoomCode activation', () => {
  test('registers probe commands after activation', async () => {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    assert.ok(extension, 'extension is installed in the test host');
    await extension.activate();
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('doomcode.spike.probeBrowserRoutes'));
    assert.ok(commands.includes('doomcode.spike.stopProbeSession'));
  });

  test('activation starts no debug session', async () => {
    assert.strictEqual(vscode.debug.activeDebugSession, undefined);
  });
});

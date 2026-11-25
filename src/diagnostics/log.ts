/**
 * Module: log.ts
 * Description: DoomCode's diagnostic output channel. Every message passes through
 * redaction before it reaches the host log.
 */

import * as vscode from 'vscode';
import { redact } from './redact';

export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

/**
 * Creates the DoomCode log output channel and a redacting logger over it.
 *
 * @param context - Extension context that owns the channel's lifetime.
 * @returns Logger that redacts every message.
 */
export function createLogger(context: vscode.ExtensionContext): Logger {
  const channel = vscode.window.createOutputChannel('DoomCode', { log: true });
  context.subscriptions.push(channel);
  return {
    info: (message) => channel.info(redact(message)),
    warn: (message) => channel.warn(redact(message)),
    error: (message) => channel.error(redact(message)),
  };
}

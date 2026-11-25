import { describe, expect, it } from 'vitest';
import { redact } from '../../src/diagnostics/redact';

describe('redact', () => {
  it('removes URLs', () => {
    expect(redact('opened https://www.tiktok.com/foryou ok')).toBe('opened <url> ok');
  });

  it('removes Windows and home paths', () => {
    expect(redact(String.raw`read C:\Users\dev\proj\a.ts`)).toBe('read <path>');
    expect(redact('read /Users/dev/proj')).toBe('read <path>');
  });

  it('removes long numeric identifiers', () => {
    expect(redact('post 7234567890123456789 failed')).toBe('post <id> failed');
  });

  it('leaves ordinary diagnostics intact', () => {
    expect(redact('startDebugging returned true')).toBe('startDebugging returned true');
  });
});

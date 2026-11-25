import { describe, expect, it } from 'vitest';
import { FOR_YOU_URL, LOGIN_URL, isAllowedHandoffUrl } from '../../src/constants/urls';

describe('isAllowedHandoffUrl', () => {
  it('accepts the fixed For You and login URLs', () => {
    expect(isAllowedHandoffUrl(FOR_YOU_URL)).toBe(true);
    expect(isAllowedHandoffUrl(LOGIN_URL)).toBe(true);
  });

  it.each([
    ['http scheme', 'http://www.tiktok.com/foryou'],
    ['bare host', 'https://tiktok.com/foryou'],
    ['lookalike host', 'https://www.tiktok.com.evil.example/foryou'],
    ['subdomain', 'https://m.tiktok.com/foryou'],
    ['credentials', 'https://user:pass@www.tiktok.com/foryou'],
    ['explicit port', 'https://www.tiktok.com:8443/foryou'],
    ['query string', 'https://www.tiktok.com/foryou?redirect=https://evil.example'],
    ['fragment', 'https://www.tiktok.com/foryou#x'],
    ['unlisted path', 'https://www.tiktok.com/@someone/video/1234567890123456789'],
    ['trailing slash', 'https://www.tiktok.com/foryou/'],
    ['command uri', 'command:workbench.action.openSettings'],
    ['malformed', 'not a url'],
    ['empty', ''],
  ])('rejects %s', (_label, url) => {
    expect(isAllowedHandoffUrl(url)).toBe(false);
  });
});

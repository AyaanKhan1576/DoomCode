/**
 * Module: urls.ts
 * Description: Fixed allowlist of TikTok full-site URLs that DoomCode may hand off
 * to a browser surface. Only these exact URLs are ever opened by the router.
 */

export const TIKTOK_HOST = 'www.tiktok.com';

export const FOR_YOU_URL = 'https://www.tiktok.com/foryou';
export const LOGIN_URL = 'https://www.tiktok.com/login';

const ALLOWED_PATHS: ReadonlySet<string> = new Set(['/foryou', '/login']);

/**
 * Checks whether a URL is one of DoomCode's allowlisted full-site handoff targets.
 *
 * The check is exact: HTTPS only, the exact TikTok host, no credentials, no port,
 * no query or fragment, and a path from the allowlist.
 *
 * @param candidate - URL string to validate.
 * @returns True when the URL is an allowlisted handoff target.
 */
export function isAllowedHandoffUrl(candidate: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return false;
  }
  return (
    parsed.protocol === 'https:' &&
    parsed.hostname === TIKTOK_HOST &&
    parsed.username === '' &&
    parsed.password === '' &&
    parsed.port === '' &&
    parsed.search === '' &&
    parsed.hash === '' &&
    ALLOWED_PATHS.has(parsed.pathname)
  );
}

/**
 * Module: redact.ts
 * Description: Removes URLs and Windows/POSIX file paths from diagnostic text so
 * logs never carry links, video identifiers, or user paths.
 */

const URL_PATTERN = /\b[a-z][a-z0-9+.-]*:\/\/[^\s"'<>]+/gi;
const WINDOWS_PATH_PATTERN = /\b[a-z]:\\[^\s"'<>]*/gi;
const POSIX_HOME_PATTERN = /(?:\/home|\/Users)\/[^\s"'<>]+/g;
const LONG_NUMERIC_ID_PATTERN = /\b\d{15,}\b/g;

/**
 * Redacts sensitive substrings from a diagnostic message.
 *
 * @param message - Raw diagnostic text.
 * @returns The message with URLs, paths, and long numeric IDs replaced.
 */
export function redact(message: string): string {
  return message
    .replace(URL_PATTERN, '<url>')
    .replace(WINDOWS_PATH_PATTERN, '<path>')
    .replace(POSIX_HOME_PATTERN, '<path>')
    .replace(LONG_NUMERIC_ID_PATTERN, '<id>');
}

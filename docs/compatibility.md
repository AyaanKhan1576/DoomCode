# Compatibility matrix

This is the Phase 0 spike record (PRD, "Phase 0 compatibility spike"). Each entry separates the API result from what the tester observed. A successful command or launch call does not prove that the page opened, played, or signed in.

Outcomes: `pass`, `partial`, `fail`, `unavailable`, `not run`.

## Environment

| Field | Value |
| --- | --- |
| Windows | Windows 11 Home 10.0.26200 |
| VS Code (installed) | 1.147.0 |
| VS Code (test host, `@vscode/test-cli` stable) | 1.148.0 |
| Cursor | Not installed on the development machine. Not run. |

## Tool evidence (2026-11-25, automated inventory in the VS Code 1.148.0 test host)

- `ms-vscode.js-debug` (built in) contributes the `editor-browser` and `pwa-editor-browser` debugger types. This makes route (a) a candidate.
- These browser commands exist: `workbench.action.browser.open`, `workbench.action.browser.closeAll`, `workbench.action.browser.closeAllInGroup`, `workbench.action.browser.openExternal`, `workbench.action.browser.toggleMobileEmulation`, `workbench.action.browser.reload`, and others. Their arguments are undocumented. Presence establishes discoverability only.

## Launch routes for `https://www.tiktok.com/foryou`

| Host / build | Route | API result | Opened in integrated browser | For You renders + audio | TikTok auto-scroll, wheel, drag, arrows | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| VS Code 1.147.0 | (a) `editor-browser` debug launch | not run | not run | not run | not run | |
| VS Code 1.147.0 | (b) `openExternal` + user-configured opener | not run | not run | not run | not run | |
| VS Code 1.147.0 | (c) `workbench.action.browser.open` (undocumented) | not run | not run | not run | not run | Probe only |
| Cursor | (a), (b), (c) | not run | not run | not run | not run | |

## Tab ownership and lifecycle

| Host / build | Check | Result | Notes |
| --- | --- | --- | --- |
| VS Code 1.147.0 | `stopDebugging(probeSession)` closes or stops only the DoomCode tab | not run | |
| VS Code 1.147.0 | `onDidTerminateDebugSession` fires when the user closes the tab | not run | |
| VS Code 1.147.0 | Editor keybindings fire while focus is inside the browser page | not run | |

## Sign-in (manual; no credentials in this record)

| Host / build | Method | Signs in | Persists across restart (`global` storage) | Untrusted workspace / empty window | Debugger-attached detection | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| VS Code 1.147.0 | Email / phone | not run | not run | not run | not run | |
| VS Code 1.147.0 | QR code | not run | not run | not run | not run | |
| VS Code 1.147.0 | Google | not run | not run | not run | not run | |

## How to run the probe

1. Run `npm install` and `npm run build`. Then press F5 in VS Code with the **Run DoomCode (Extension Development Host)** configuration.
2. In the development host, run **DoomCode (Dev): Run Browser Route Probe** and pick a route.
3. Record what you observed when prompted. Each result is written to the **DoomCode** output channel as `host | version | route | API result | observed`.
4. For route (a), run **DoomCode (Dev): Stop Browser Probe Session** to test the ownership checks.
5. To test a packaged build in Cursor, run `npm run package` and install `dist/doomcode.vsix` with **Extensions: Install from VSIX...**.

# Continuity ledger

Entries are dated. The source is one of: user, code, tool evidence, assumption.

## Decisions

- **2026-11-25 (user):** The personalized For You page opens in the editor's integrated browser. The user signs in during extension setup. TikTok's own UI owns auto-scroll and navigation. DoomCode provides the window, the setup, and the controls around it.
- **2026-11-25 (user):** The staged plan was approved: Stage 0 spike through Stage 8 deployment.
- **2026-11-25 (code):** TypeScript is pinned to 6.0.3 because `typescript-eslint` 8.74.0 supports `<6.1.0`.
- **2026-11-25 (assumption):** `engines.vscode` is set to `^1.100.0` provisionally, so that the spike VSIX can install on Cursor builds with older bases. The real floor is set after Stage 0.
- **2026-11-25 (assumption):** The publisher ID `doomcode-dev` and `"license": "UNLICENSED"` are placeholders until the namespace and license are chosen.

## State

- **2026-11-25 (code):** Stage 1 scaffold is complete. Typecheck, lint, unit tests, integration tests, and packaging pass. The Stage 0 probe command is implemented.
- **2026-11-25 (tool evidence):** The VS Code 1.148.0 test host contributes the `editor-browser` debugger and exposes `workbench.action.browser.open`, which is undocumented. See `docs/compatibility.md`.

## Blockers

- **2026-11-25:** Cursor is not installed on the development machine, so the Cursor column of the Stage 0 spike cannot be run.
- **2026-11-25:** The Stage 0 manual checks (launch, playback, sign-in, ownership) need a person at the editor and have not been run.

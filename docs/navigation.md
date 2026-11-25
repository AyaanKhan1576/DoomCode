# Repository navigation

| Path | Responsibility |
| --- | --- |
| `PRD.md` | Product scope, phased requirements, acceptance criteria |
| `AGENTS.md` | Standing engineering rules for coding agents |
| `CONTINUITY.md` | Dated ledger of durable decisions and blockers |
| `docs/compatibility.md` | Phase 0 and release host/route matrix |
| `src/extension.ts` | Activation and command registration only |
| `src/constants/urls.ts` | Fixed allowlist of TikTok handoff URLs |
| `src/diagnostics/` | Redaction (`redact.ts`) and the DoomCode log channel (`log.ts`) |
| `src/spike/` | Phase 0 browser route probe. To be removed or gated before release |
| `test/unit/` | Vitest unit tests for host-independent modules |
| `test/integration/` | Mocha tests run in the Extension Development Host via `@vscode/test-cli` |
| `scripts/build.mjs` | esbuild bundle of the extension host entry |

Planned modules (Stages 2–6): `src/browser/` (router and adapters), `src/setup/` (walkthrough and versioned state), `src/session/` (toggle, Boss, Focus, focus return), `src/webview/` (control panel and the embed queue).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run build` / `npm run watch` | Bundle to `dist/extension.js` |
| `npm run typecheck` | `tsc` with no emit |
| `npm run lint` | ESLint over `src` and `test` |
| `npm run test:unit` | Vitest |
| `npm run test:integration` | Build, compile tests to `out/`, run them in a downloaded VS Code stable |
| `npm run package` | Production bundle and `dist/doomcode.vsix` |

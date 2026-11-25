# AGENTS.md

Operating instructions for coding agents working on DoomCode. Follow explicit user directions and higher-priority instructions. Apply more specific repository guidance within its directory. Use this file for standing engineering rules and [PRD.md](PRD.md) for product scope, phased requirements, and release criteria.

## 1. Start with the repository

- Read the relevant PRD requirements and acceptance criteria. Confirm whether the requested work is part of the current phase. Treat open PRD decisions as open.
- Read `CONTINUITY.md` and `docs/navigation.md` when they exist and are relevant. Otherwise start with the files that exist. Once the extension is scaffolded, inspect its manifest, package scripts, affected entry points, and tests before searching more broadly.
- Prefer targeted reads and `rg` searches. Use additional tools when they address a concrete gap. Verify important findings against the repository or primary documentation.
- For nontrivial changes, state a short approach and an observable success condition before editing. Identify affected contracts and material assumptions. Ask before dependent work if the choice changes scope, compatibility, or security and the evidence cannot settle it.
- Use actual paths, commands, API names, and test results. Distinguish documented capability, observed behavior, and unverified inference.

## 2. Work in DoomCode's stack

- Build a Windows-first desktop extension for VS Code and Cursor using TypeScript, Node.js LTS, npm, and PowerShell. Use the repository's pinned versions and scripts once they exist. Verify commands before documenting them.
- Start with one shared extension. Keep activation and manifest registration small. Separate extension-host code, bundled webview UI, playback routing, local state, and host or provider integrations where their responsibilities differ.
- Use stable VS Code extension APIs for the shared core and verify behavior independently in Cursor. A command appearing in a host establishes discoverability only. Verify its arguments, outcome, and supported builds before relying on it.
- Keep changes scoped and match existing conventions. Aim to keep authored source and test files under 300 lines by splitting at clear responsibilities. Preserve user changes and public behavior unless the task changes them.
- Reuse existing logic. Add dependencies only for concrete needs, prefer maintained packages, and record the reason and lockfile changes. Confirm adoption when a new service or dependency materially changes trust, distribution, or architecture.
- Handle expected failures with actionable UI or redacted diagnostics. Preserve explicit product recovery paths and surface unexpected failures for diagnosis. Never claim a successful open or playback based on a command or iframe load alone.

## 3. Preserve playback and editor behavior

- Render the queue in the custom `WebviewViewProvider` with one official TikTok post player mounted at a time. Treat full-site browsing as a separate action. The For You tab (PRD R12) is a full-site action through the browser router, and TikTok's own UI owns its feed behavior. Preserve provider attribution and supported player controls.
- Keep the order explicit: custom webview, integrated browser on validated hosts, then external browser on user request. Keep the selected post on failure. Offer a manual in-editor route or copyable link when appropriate. Do not change browser placement, URI opener, or other user settings to force a handoff.
- Keep browser adapters isolated and capability-gated. Validate automated launch separately in VS Code and Cursor. Treat TikTok playback and sign-in in a handed-off browser as separate checks. Limit control to DoomCode-owned surfaces unless exact tab ownership and a supported action are verified.
- Use the same session rules across commands, keybindings, and view actions. Preserve focus return, stop owned playback when required, and prevent automatic playback or browser launches on startup or restore. Focus mode blocks new DoomCode playback and handoffs. Boss mode presents the neutral state and does not cancel the focus timer.
- Respect host themes, keyboard navigation, visible focus, high contrast, and reduced motion. Keep cat interactions scoped to DoomCode, preserve the plain appearance option, and make unlocks keyboard-accessible.
- Keep task and Git integrations opt-in and respect Workspace Trust where applicable. Verify task and commit signals before acting. Use manual agent waiting mode until a documented lifecycle integration has been validated for that host.

## 4. Protect privacy and trust boundaries

- Validate canonical HTTPS provider links before building a player or browser URL. Use exact host and route checks. Scope webview CSP and local resource roots to required provider frames and bundled assets. Keep command URIs disabled.
- Validate provider messages against the exact origin, current frame, and expected payload. Validate webview-to-host messages independently against a small set of known actions. Keep remote content away from privileged host actions.
- Use official embeds and supported APIs. Do not bypass framing policies, rewrite authentication headers, scrape feeds, proxy provider pages, or automate sign-in. Do not promise an embedded personalized feed or cross-editor browser API parity.
- Keep tracking opt-in, local, and outside Settings Sync. Preserve reset behavior and handle restarts and concurrent windows without inflating or losing totals. Keep credentials, video URLs and IDs, prompts, source code, paths, and commit contents out of diagnostic logs. Keep release credentials out of source and package artifacts.

## 5. Verify before reporting completion

- Reproduce bugs when practical. Cover nontrivial logic and regressions using the project's test tooling. Exercise the normal entry point and relevant failed, cancelled, retried, or overlapping operations.
- Run applicable tests, type checks, lint, and builds when configured. Review the final changes for scope. For documentation-only changes, verify file references and consistency with the PRD.
- Validate host behavior with the VS Code Extension Development Host and packaged VSIX smoke tests on Windows in both advertised editors. For sidebar changes, exercise narrow widths, keyboard and iframe focus, themes, and playback cleanup. Test browser fallback with missing capabilities, rejected launches, and blocked or unavailable media.
- Record exact host versions and per-route results for compatibility claims. Keep deterministic fixtures for routine checks, and test live provider behavior separately. Verify install and update through Visual Studio Marketplace for VS Code and Open VSX through Cursor before making distribution claims.
- If a check fails, fix the cause within scope and rerun it. If a check is unavailable, state the blocker and the resulting verification gap.

## 6. Maintain continuity and communicate

- Update the relevant project docs when behavior, commands, architecture, or compatibility changes. Keep proposed decisions distinct from implementation evidence.
- When a continuity ledger exists, keep it brief and update it only for durable decisions, meaningful state changes, and unresolved blockers. Date entries and identify whether they come from the user, code, tool evidence, or an assumption. Create a ledger only when sustained work warrants one.
- If an approach fails twice for the same reason, reassess the evidence before retrying. Record a standing rule here only when a recurring project-specific lesson warrants one.
- Communicate directly and without filler. Report what changed, what was verified, and what remains open. If asked to commit, use a descriptive subject under 72 characters and omit agent attribution unless requested or required.

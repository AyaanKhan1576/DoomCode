# DoomCode PRD

**Status** · Draft for implementation  
**Release target** · Windows desktop, Visual Studio Code and Cursor  
**Product name** · DoomCode, working title

## Product

DoomCode gives developers a short-form video break inside their editor. Open a narrow sidebar, browse a queue of public TikTok posts, and return to code with the same shortcut. The MVP queue comes from links the user adds, with an optional starter set if suitable public posts are cleared for use. A browser handoff gives users a way to visit TikTok’s own site when a post cannot play in the sidebar or they explicitly want the full site.

The target user is a developer who already takes short breaks while building, testing, or waiting on an AI agent and wants a quick way back to the editor. The experience should feel native through editor commands, keybindings, theming, and sidebar placement. Initial support covers local Windows desktop workspaces, including an empty window for core browsing. Remote workspaces, browser-based editors, macOS, and Linux are outside the initial support matrix.

**MVP outcome.** In each supported editor, users can open TikTok's own For You page in the editor's integrated browser and sign in there during setup. They can add a public post to the sidebar queue, move between posts, and leave the session in one action. When playback fails, the same post can be handed off through a clear recovery path. TikTok's website owns the personalized feed, auto-scroll, navigation, and sign-in. DoomCode does not embed, read, or automate that feed. TikTok API account integration, media downloads, and engagement actions are outside MVP scope.

## Requirements and release scope

| ID | Feature | Behavior | Phase |
| --- | --- | --- | --- |
| R1 | Native TikTok sidebar | Contribute a DoomCode view backed by a custom `WebviewViewProvider`. Users add canonical public TikTok post links, scroll or use Previous and Next, remove or reorder entries, and play one official embed at a time. Show a helpful empty state, retry action, and per-post browser handoff. Start without audible autoplay. | MVP |
| R2 | Keyboard toggle | Register a rebindable Windows shortcut and a Command Palette command. Reveal and focus DoomCode on open. On close, collapse or hide the DoomCode surface using a verified host action, stop embedded playback, and return focus to the last active editor when available. Keep a direct hide action in the view header. | MVP |
| R3 | Browser fallback | The integrated browser is the primary surface for the For You page (R12). For single posts, after an unavailable or failed embed, offer the original post in the editor’s integrated browser on verified builds. Allow a deliberate full-site launch using the same order. Offer the external browser last, when the integrated route is missing, fails to launch, or the user reports it cannot play or sign in. Preserve the sidebar queue and selection on handoff. | MVP |
| R4 | Boss mode | One rebindable shortcut replaces the DoomCode view with a neutral cat-free idle state, removes the player, clears DoomCode status indicators, and returns focus to code where available. Require explicit restore. For browser handoffs, state the limits of DoomCode control. | MVP |
| R5 | Focus mode | Offer a timer with an initial 25-minute preset and an explicit end control. While active, stop the embed and block DoomCode entry points, automatic suggestions, rewards, and new browser handoffs. Show remaining time in the editor. Restore the normal idle state when the timer ends and require a user action to resume. | MVP |
| R6 | Brainrot counter | Opt-in local tracking of eligible DoomCode session time and sessions opened, summarized by day. Label the measure as DoomCode time. Provide disable and reset controls. Time applies only while a ready embedded player is visible in a focused editor window, including when the player is paused. | MVP |
| R7 | Cat avatars and Easter eggs | Bundle original avatars and optional in-view discoveries. Keep a plain appearance setting, support reduced motion, and avoid surprise sounds. Boss mode always uses the neutral appearance. | MVP, expanded in Phase 2 |
| R8 | Compilation mode | Opt-in for explicitly selected editor tasks. Offer a break after a configurable delay while a matching task runs. Reuse one break across overlapping matching tasks. On the final matching task’s end, error, or cancellation, dismiss the offer and stop any compilation-owned embedded session. | Phase 2 |
| R9 | AI agent waiting mode | Start with a manual **Start Agent Wait** timer and **Agent Ready** command. Offer a break while waiting and end the mode on completion or expiry. Consider an automatic adapter only for hosts that expose stable, documented, validated lifecycle events. | Phase 2 manual, Phase 3 automatic if feasible |
| R10 | Git commit reward | Opt-in celebration after a verified new local commit on the active branch. Offer a small avatar or a user-initiated timed break. Detect through a documented, validated Git integration. Handle first observation, repository removal, branch changes, amend/reset, merge commits, and duplicate events without triggering surprise rewards. | Phase 2 |
| R11 | Multi-platform mode | Add a provider switcher and separately validated adapters. Evaluate YouTube Shorts first and Instagram Reels second. Enable a provider only after public post embed, attribution, policy, and browser handoff checks. Keep each queue and failure state independent. | Phase 3 |
| R12 | For You browser window | A setup walkthrough checks host capability and shows the launch route. It explains third-party traffic and browser-owned cookies, then opens `https://www.tiktok.com/login` in the integrated browser so the user can sign in on TikTok's page. The user confirms sign-in manually, because DoomCode cannot read browser state. It stores only setup completion and the chosen route. The toggle opens or reveals the DoomCode-launched `https://www.tiktok.com/foryou` tab. TikTok's UI owns auto-scroll, Next and Previous, wheel, and drag. DoomCode injects no script and controls only the tab it launched, through a verified ownership handle. Without that handle, toggle-off returns focus to code and states that the tab keeps playing. Hosts without a verified launch route use the external browser on user request. | MVP |

### Session rules

- Opening the empty view, starting the editor, restoring a window, or turning off Focus or Boss mode does not mount a remote player until the user requests one. New browser launches always require a user action.
- Boss mode takes precedence over Focus mode for presentation. A focus timer keeps running while the view is hidden. Leaving Boss mode never cancels a focus timer.
- Leaving the view, losing window focus, changing the selected post, or enabling Boss or Focus mode stops the timer and requests playback pause. Remove the iframe if pause cannot be confirmed or when the surface is hidden. Resume requires a user action after Boss or Focus mode.
- DoomCode controls its own surface. A handed-off page may keep playing and may consume keyboard shortcuts. Any editor-browser hide or close behavior requires a verified way to identify and control only the exact DoomCode-owned tab. An external browser tab remains user-controlled.
- Compilation and agent modes suggest a break without stealing focus. They stop only the embedded session they initiated. Git rewards never interrupt active work or open a provider automatically.

### Cat details

| Surface | Proposed detail |
| --- | --- |
| Avatar picker | Ship Tabby, Tuxedo, Calico, Void, Orange, and a rotating daily choice drawn from the bundled set. |
| Empty and unavailable states | A paper-box kitten in the empty queue and a curled-up cat on the offline card. |
| Hidden interactions | Clicking the avatar nine times unlocks Nine Lives. Typing `meow` in the avatar picker unlocks Terminal Cat. Hidden sequences are scoped to DoomCode UI and mirrored by a keyboard-accessible discovery action. |
| Session milestones | Focus completion reveals a sleeping cat when the user returns. The first eligible Git reward unlocks Commit Kitten. |
| Optional extras | Paw-print progress ticks, a reduced-motion-safe slow blink, and a cat-themed About panel. Provide descriptive names and a plain appearance switch. |

## Playback architecture and compatibility

Use one TypeScript desktop extension with a small bundled sidebar UI. Contribute a view container, its webview view, commands, keybindings with scoped context keys, and settings via the extension manifest. Activate on DoomCode interaction. Keep feature modules separate for playback routing, user modes, tracking, and optional task, agent, and Git adapters. Use the stable host API surface for the shared core. [VS Code extension API](https://code.visualstudio.com/api/references/vscode-api), [Webview guide](https://code.visualstudio.com/api/extension-guides/webview)

### Routing order

1. **Custom sidebar.** Validate HTTPS TikTok URLs against the exact supported host and canonical public post path, extract a numeric ID, and construct the official `https://www.tiktok.com/player/v1/{post_id}` URL. Keep the queue and controls local. Mount a single cross-origin iframe for the active post. Validate the player’s documented messages before marking the player ready or handling errors. An iframe load event alone is insufficient. Use a bounded ready timeout, initially 10 seconds, and a clear retry state. Allow a user to request fallback while waiting. Advertise the full-site action separately because it uses a top-level browser page. [TikTok Embed Player](https://developers.tiktok.com/docs/en/embed-player)
2. **Integrated browser.** Use a host-specific adapter only after validating the exact host/build, command or supported opener, URL arguments, and resulting tab behavior. Check command presence where applicable and handle absent or rejected launch. Successful command execution indicates a handoff attempt. It gives DoomCode no proof of playback or sign-in. If a browser UI is present without a verified programmatic launch, offer a manual in-editor route with an explicit copy action. Do not change user browser placement or URI-opener settings. [VS Code integrated browser](https://code.visualstudio.com/docs/debugtest/integrated-browser), [Cursor Browser documentation](https://cursor.com/docs/agent/tools/browser)
3. **External browser.** On a deliberate user action, submit the same validated HTTPS URL through `vscode.env.openExternal`. Handle a false result or rejection and offer Copy Link. The actual destination depends on the host’s opener configuration. Confirm Windows behavior in the matrix and use copy as recovery if settings intercept the handoff. [VS Code external URI API](https://code.visualstudio.com/api/references/vscode-api#env.openExternal)

### API and provider limits

- **TikTok.** The official Embed Player renders individual posts. Keep the full TikTok website out of the sidebar iframe implementation. Embedding may fail due to provider policy, region, age or privacy restrictions, removed posts, rate limits, network conditions, or browser media rules. Retain TikTok’s attribution and controls. Do not rewrite framing or cookie headers, proxy the site, automate sign-in, scrape feeds, or call undocumented endpoints. [TikTok Embed Player](https://developers.tiktok.com/docs/en/embed-player)
- **Accounts and feeds.** TikTok’s Display API provides authorized creator profile data and video metadata. It does not supply DoomCode with a viewer’s personalized For You feed. Its authorization and review requirements apply to any future Display API integration. Sign-in, if available, happens in the browser that owns the session. Treat logged-in playback as a separate test case. [TikTok Display API overview](https://developers.tiktok.com/docs/en/display-api-overview), [Display API setup](https://developers.tiktok.com/docs/en/display-api-get-started)
- **Editor browsers.** VS Code documents its desktop browser UI. Cursor documents a browser for its Agent. Those docs establish user-facing features and provide no cross-editor contract for DoomCode’s launcher. Command discovery alone cannot establish argument compatibility, tab placement, playback, or cookie behavior. Any dependency on an undocumented command requires a separate release decision and can be disabled per host build. [VS Code integrated browser](https://code.visualstudio.com/docs/debugtest/integrated-browser), [Cursor Browser documentation](https://cursor.com/docs/agent/tools/browser)
- **Work signals.** For compilation, use available `vscode.tasks` lifecycle events. Test process exit status where applicable. Terminal commands run outside the editor’s task system may never emit those events. Automatic agent mode requires a public, permission-appropriate integration for each host. Keep manual mode available everywhere supported. Git reward must use a reliable event or verified read-only observation in a trusted workspace. An arbitrary HEAD change is insufficient evidence of a new local commit. [VS Code tasks API](https://code.visualstudio.com/api/references/vscode-api#tasks)

### State and Windows development

- Store the queue, avatar choices, and optional daily totals locally with versioned extension state. Keep tracking and queues out of Settings Sync. Use a restorable focus deadline and per-window mode state. Serialize updates within a host and test cross-window persistence. For the counter, use independently keyed window/session records and merge totals without stale overwrites. Label concurrent use as window time if it can count overlapping sessions.
- Use monotonic elapsed time for active sessions and local calendar boundaries for daily totals. Checkpoint periodically and on visibility changes. Bound unflushed loss to 30 seconds in normal operation and avoid counting sleep, startup, or background time. Reset clears historical records and starts a fresh measurement from the reset point when tracking remains enabled.
- Develop in PowerShell with Node.js LTS, npm, and TypeScript. Pin the toolchain and lock dependencies. Use the VS Code Extension Development Host for iteration and verify the packaged VSIX independently in Cursor on Windows. Test clean profiles and a Windows workspace with spaces and non-ASCII characters. Set `engines.vscode` from the API floor and publish an explicit tested version matrix for both products.

## Security, privacy, and accessibility

- Constrain `localResourceRoots` to bundled assets. Start CSP with `default-src 'none'`, allow only required local scripts/styles/assets, and scope `frame-src` to the supported provider origin. Validate iframe permissions against playback requirements. Disable command URIs and reject arbitrary URLs, unexpected redirects at input, and non-HTTPS or malformed links. Short links can be deferred to a separately validated resolver.
- Validate messages at both boundaries. In the sidebar, check the provider’s exact origin, the active frame’s window, and the documented message schema. In the extension host, accept only known DoomCode actions with validated payloads. Pass messages to the player using its exact target origin. Never forward provider messages to the extension host as privileged actions.
- DoomCode ships without telemetry, a backend, or TikTok credential handling. It stores explicitly added post links or IDs for the queue. Tracking stores only local time and session aggregates. Browser traffic, provider analytics, cookies, browser history, and host browser storage are governed by the chosen surface. Explain the third-party network request before first playback and explain that resetting DoomCode history does not clear browser data.
- Keep task and Git integrations opt-in and gated on Workspace Trust where applicable. Store no source code, prompts, terminal output, commit messages, repository paths, browser cookies, or access tokens in tracking. Diagnostic output should use host version, route, and coarse error codes with URLs and identifiers omitted by default.
- Support keyboard-only navigation, visible focus, clear labels, high-contrast themes, and readable sidebar layouts at 280 CSS px and larger. Preserve useful native player controls. Respect reduced motion and provide accessible labels for avatar choices. Verify editor focus recovery separately with focus inside the cross-origin iframe.

## Testing and release acceptance

### Phase 0 compatibility spike

Run the spike on Windows 11 with the latest stable VS Code and Cursor available at test time. Repeat on the proposed oldest supported build of each. Record host/build, Windows version, region, browser policy and settings, public test post, and pass, partial, fail, or unavailable for each route below. Record sign-in and playback independently with no credentials in the test evidence. Older Windows versions can be added after validation.

| Check | VS Code desktop | Cursor desktop |
| --- | --- | --- |
| Sidebar provider, documented TikTok embed, audio stop, and keyboard focus | Required on latest stable and support floor | Required on latest stable and support floor |
| Integrated browser open with canonical post URL and full-site URL | Verify launch, tab placement, same-post playback, and optional sign-in | Probe extension launch support separately from Agent browser UI, then test the same behavior if available |
| External handoff | Verify Windows opener behavior and exact URL | Verify separately with Cursor defaults and configured opener |
| Policy and degraded states | Test absent browser command, blocked network or embed, and user-reported browser failure | Repeat independently and capture the actual fallback offered |

Run logged-out playback first using at least three eligible public posts and repeat with unavailable and invalid inputs. Test login only as a manual compatibility case where permitted. Test a failed or stalled iframe with deterministic fixtures, along with launch rejection and configurable opener behavior. Preserve the ability to run the suite when a live provider changes.

### Acceptance criteria

| ID | Pass condition |
| --- | --- |
| A1 | On every advertised host build, a clean VSIX install contributes the view and commands. The user can use the shortcut and Command Palette to open and dismiss DoomCode. Toggling from the editor and from inside the webview or player returns focus to code where available. Any host shortcut interception has a verified accessible escape path and is documented. |
| A2 | In each editor, three eligible public posts can be added and navigated with keyboard and pointer. Only one player is mounted. Switching posts stops prior audio. The queue survives reload. On blocked, removed, or stalled media, a recovery action appears by the configured 10-second deadline or sooner on a validated error. |
| A3 | Verified integrated launch receives the original post URL. Missing capability, thrown launch, and user-reported playback failure each leave an actionable external option. No external window opens by itself. An unsuccessful external handoff exposes Copy Link and preserves the selected post. |
| A4 | With an audible embed, Boss and Focus modes stop playback within one second on both validated hosts. Boss mode removes DoomCode indicators and requires explicit restore. Focus mode prevents DoomCode launches through shortcuts, commands, and UI until expiry or explicit end. Browser-owned media limits are visible at handoff. |
| A5 | Tracking defaults to off. With tracking on and a controlled clock, 60 seconds of eligible time adds 60 seconds. Switching apps, hiding the view, opening a fallback browser, and restart do not inflate it. Reset removes pre-reset history. Test concurrent windows and a session crossing midnight. |
| A6 | Packaged extension works in a narrow sidebar and in light, dark, and high-contrast themes. Keyboard users can select avatars and discover a cat unlock. Plain mode removes decorative cat presentation and reduced-motion settings stop ornamental animation. |
| A7 | Before first playback or explicit fallback, DoomCode initiates no network traffic to a video provider. Malformed URLs and forged frame messages trigger no privileged action. A package scan finds no credentials and CSP blocks unapproved sources. |
| A8 | Phase 2 ships only after matching task start, success, failure, overlap, and cancellation pass, manual agent timers end predictably, and Git rewards fire once per eligible local commit without false rewards on baseline or branch switch. Phase 3 integrations pass equivalent per-provider and per-host checks before being enabled. |

Use unit tests for URL parsing, message validation, routing, mode precedence, tracking, and optional adapter state. Use VS Code Extension Development Host integration tests for contributions and lifecycle behavior, then real packaged smoke tests in both editors for video, shortcuts, accessibility, and browser behavior. Recheck the compatibility matrix for release candidates and after relevant host or provider changes. [Testing VS Code extensions](https://code.visualstudio.com/api/working-with-extensions/testing-extension)

**Release gate.** Require the native sidebar and tested recovery on both advertised editors. A host may ship without integrated browser support when its external route passes and the listing documents the difference. If the official embed is blocked on an otherwise eligible host, keep that host in a labeled fallback-only preview or hold its release until the sidebar passes. Publish actual results for logged-out playback, optional sign-in, and integrated browser availability.

## Marketplace distribution

1. Confirm the DoomCode name, publisher namespace, extension and art licenses, TikTok usage and attribution requirements, and editor marketplace listing rules. Use original cat artwork and describe DoomCode as an independent extension.
2. Build a single versioned VSIX with `@vscode/vsce` from a tagged commit. Inspect bundle contents and sideload on both clean profiles. Keep identifiable build artifacts and a known-good VSIX for regression recovery.
3. Publish to Visual Studio Marketplace through the verified publisher workflow. Publish the same version and extension ID to Open VSX with its publisher agreement and namespace setup. Verify that Cursor search, install, and update work after its marketplace proxy review. Store release credentials in CI secrets and scope access by registry.
4. Include a compatibility table, screenshots, keyboard setup, provider and privacy disclosures, known browser limitations, changelog, license, and issue tracker in or alongside the listings. Offer a documented VSIX install path for development and preview releases. [Visual Studio Marketplace publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension), [Open VSX publishing](https://github.com/eclipse-openvsx/openvsx/wiki/Publishing-Extensions), [Cursor extensions](https://cursor.com/help/customization/extensions)

## Open decisions

| Decision | Proposed default or decision trigger |
| --- | --- |
| Which editor versions and Windows builds are supported? | Set the published floor after Phase 0 and keep a tested build list for browser adapters. |
| How is the integrated browser invoked per host? | Prefer a documented opener that passes the URL. Use manual handoff or disable the adapter where the launch contract is unclear. |
| Should DoomCode include a starter queue? | Start with user-pasted links. Bundle a small starter set only after confirming ongoing availability, attribution, and appropriate use. |
| What are the default shortcuts? | Choose and document Windows bindings after collision checks in both editors with common layouts and focus inside the player. |
| How long are brainrot totals retained? | Start with a proposed 30-day rolling window and a manual reset. Confirm retention and concurrent-window counting semantics before release. |
| What counts as an eligible commit? | Start with new non-merge local commits on the active branch. Confirm amend semantics and the contract of the chosen Git integration before enabling rewards. |
| Which waiting signals can be automated? | Ship manual agent mode first. Add automatic support only after verifying documented start, completion, cancellation, and overlapping-run events. |
| What should the next video provider be? | Run the embed and policy spike for YouTube Shorts first. Decide whether to proceed with Instagram Reels after the same checks. |
| Which route opens the For You tab? | The candidates are the documented `editor-browser` debug launch configuration and a user-configured `workbench.externalUriOpeners` entry. DoomCode never writes that setting. The undocumented `workbench.action.browser.open` is probe-only until a release decision. Choose after Phase 0. |
| How does the brainrot counter treat the For You tab? | DoomCode cannot observe playback or focus inside a browser tab. Decide whether the tab counts at all, or counts as labeled "tab open" time from a verified session lifecycle, before enabling R6 for it. |
| What if TikTok changes embed behavior after launch? | Keep routing independently testable, document the browser route, and ship a compatibility update with an updated support matrix. |

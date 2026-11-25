# DoomCode

DoomCode is a development preview of a VS Code and Cursor extension for Windows. It opens TikTok's own website in the editor's integrated browser. You sign in on TikTok's page, and TikTok controls the feed, scrolling, and playback. DoomCode is an independent extension and is not affiliated with TikTok.

The current build contains only the Phase 0 compatibility probe. See `docs/compatibility.md`.

## Development

Requires Node.js 24 LTS, npm, and Windows PowerShell.

```powershell
npm install
npm run build
npm run test:unit
npm run test:integration
npm run package   # produces dist/doomcode.vsix
```

Press F5 in VS Code to launch the Extension Development Host.

## Privacy

DoomCode has no backend and no telemetry, and it handles no TikTok credentials. Pages opened in the editor's browser send traffic to TikTok, and the editor's browser storage holds the cookies. Resetting DoomCode does not clear browser data.

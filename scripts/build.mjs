/**
 * Bundles the extension host entry point with esbuild.
 * Flags: --watch rebuilds on change, --production minifies and drops source maps.
 */
import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');
const production = process.argv.includes('--production');

const options = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  external: ['vscode'],
  sourcemap: !production,
  minify: production,
  logLevel: 'info',
};

try {
  if (watch) {
    const context = await esbuild.context(options);
    await context.watch();
  } else {
    await esbuild.build(options);
  }
} catch (error) {
  console.error('Build failed:', error instanceof Error ? error.message : error);
  process.exit(1);
}

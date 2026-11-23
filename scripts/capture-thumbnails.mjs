/**
 * Captures the exhibit thumbnails used on the home page and as social images.
 *
 * Rules (see AGENTS.md, "Exhibit Thumbnails"):
 *  - dark theme
 *  - only the experience itself: no controls overlay, no site header, so the
 *    images do not go stale when the controls change
 *
 * Usage:
 *   npm run build
 *   npx serve dist -l 4321        (or any static server for ./dist)
 *   node scripts/capture-thumbnails.mjs [http://localhost:4321] [name ...]
 *
 * Requires Playwright with Chromium (not a project dependency):
 *   npm install --no-save playwright && npx playwright install chromium
 */
import { createRequire } from 'node:module';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith('http')) ?? 'http://localhost:4321';
const only = args.filter((a) => !a.startsWith('http'));

const WIDTH = 1200;
const HEIGHT = 676; // 16:9, matches the 600x338 gallery cards

const wait = (page, ms) => page.waitForTimeout(ms);

// Everything that is chrome around the experience rather than part of it
const HIDE_CHROME = `
  .layout > header,
  .controls-overlay,
  .variant-picker,
  .replay-hint {
    display: none !important;
  }
`;

/** Restart the simulation, then freeze it `ms` into the run. */
async function replayAndPauseAt(page, ms) {
  await page.waitForSelector('.replay-btn:not([disabled])', { timeout: 15000 });
  await page.click('.replay-btn');
  await wait(page, ms);
  await page.click('.pause-btn');
}

const shots = {
  // Fast side has rendered, slow side is still blank
  'slow-starter': {
    path: '/exhibits/slow-starter/',
    target: '#comparison-stage',
    prepare: (page) => replayAndPauseAt(page, 1900),
  },
  // Lead present on the right, still missing on the left
  'buried-lead': {
    path: '/exhibits/buried-lead/',
    target: '#comparison-stage',
    prepare: (page) => replayAndPauseAt(page, 1700),
  },
  // Finished run: the left article has been pushed around, the right has not
  'layout-leap': {
    path: '/exhibits/layout-leap/',
    target: '#comparison-stage',
    prepare: (page) =>
      page.waitForSelector('.replay-btn:not([disabled])', { timeout: 15000 }),
  },
  // The matrix of buttons and text fields with the default latency selected
  'input-abyss': {
    path: '/exhibits/input-abyss/',
    target: '.exhibit-stage',
    prepare: (page) => wait(page, 300),
  },
  // Home page gallery
  museum: {
    path: '/',
    target: '.welcome-stage',
    prepare: (page) => wait(page, 500),
  },
};

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1100, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});

for (const [name, shot] of Object.entries(shots)) {
  if (only.length && !only.includes(name)) continue;

  await page.goto(base + shot.path, { waitUntil: 'load' });
  await wait(page, 1500); // Preparation shield
  await shot.prepare(page);
  await page.addStyleTag({ content: HIDE_CHROME });
  await wait(page, 100);

  const png = await page.locator(shot.target).first().screenshot();
  const { width } = await sharp(png).metadata();
  const cropHeight = Math.round((width * HEIGHT) / WIDTH);
  const out = `src/assets/${name}.webp`;

  await sharp(png)
    .extract({ left: 0, top: 0, width, height: cropHeight })
    .resize(WIDTH, HEIGHT)
    .webp({ quality: 80 })
    .toFile(out);
  console.log(`captured ${out}`);
}

await browser.close();

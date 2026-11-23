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
  // Stable side finished, leaping side still waiting for its late elements.
  // Both sides load on the same clock, so this moment never happens on its
  // own: the run is paused before any image arrives (the leaping side is
  // exactly as the visitor sees it then) and only the stable side is
  // completed by hand.
  'layout-leap': {
    path: '/exhibits/layout-leap/',
    target: '#comparison-stage',
    prepare: async (page) => {
      await page.waitForSelector('.replay-btn:not([disabled])', {
        timeout: 15000,
      });
      // Drag the scrubber to its maximum so every late element leaps
      const box = await page.locator('#cls-scrubber').boundingBox();
      await page.mouse.click(box.x + box.width - 2, box.y + box.height / 2);
      await wait(page, 2000); // Fonts have swapped, images not started yet
      await page.click('.pause-btn');
      await page.evaluate(() => {
        document
          .querySelectorAll(
            '#stable-banner, #stable-hero-wrapper, #stable-hero, #stable-side-wrapper, #stable-side'
          )
          .forEach((el) => el.classList.add('visible'));
        document.querySelectorAll('#stable-article img').forEach((img) => {
          img.style.animation = 'none';
          img.style.clipPath = 'none';
        });
        const bar = document.getElementById('stable-progress');
        if (bar) bar.style.width = '100%';
      });
      await wait(page, 600);
    },
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

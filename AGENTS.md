# Project Roadmap: UX Speed Museum

This document outlines the architectural strategy and implementation phases for the UX Speed Museum.

## Architectural Vision

The application is built as a multi-page site using Astro in **Static Site Generation (SSG) mode**. Each exhibit is a self-contained page where all potential states (hidden or visible) are pre-rendered.

### Navigation & Loading Strategy

- **Custom Domain:** The project is hosted on `museum.uxspeed.dev`.
- **Pre-fetch on Intent:** Use Astro's pre-fetching mechanisms (hover/tap) to warm up the browser cache.
- **The Preparation Shield:** An inline component positioned under the exhibit description that shows a "preparing your experience" state until all resources are ready.

## Phase 1: Foundation (Scaffolding)

- [x] Initialize Astro + TypeScript project (**Static Site Generation mode**).
- [x] Establish a "Vanilla CSS" design system with **Light and Dark mode** support.
- [x] Create an `ExhibitLayout.astro` component with inline **Preparation Shield** logic.
- [x] Implement the `ExhibitDescription` component (Static text only).
- [x] Implement the `PerformanceController` component for real-time manipulation. - [x] **Integrated REPLAY Button:** Moved the REPLAY button into the `PerformanceController` header. - [x] **Pause/Resume Functionality:** Added a PAUSE/RESUME button to the controller, allowing users to freeze simulations mid-load to inspect the current state. - [x] **Smart Visibility & Stability:** Buttons only appear when relevant and use `visibility: hidden` to avoid layout shifts. - [x] **Infinite Loop Prevention:** Events are now flagged with a `source` to distinguish between manual scrubber releases and automated simulation completions.

## Phase 2: Core Exhibits (MVP)

- [x] **Exhibit 1: The Slow Starter.**
  - **Concept:** Progressive rendering of a realistic e-commerce product page.
  - **Fast Side:** Starts rendering at **500ms** (CrUX FCP P5 baseline). Note: only 5% of websites start rendering faster than this.
  - **Slow to Start Side:** Controllable "**Time to start rendering**" (500-5500ms) via scrubber.
  - **Scrubbing Logic:** Content and timers hide immediately; sequence restarts on release.
  - **Content:** Realistic Navigation, Hero, Realistic Image (locally generated), Details, and Footer.
  - **Local Assets:** The product image is a realistic photograph stored locally to ensure consistent performance simulation.
  - **Animation:** Staggered 11-step paint sequence.
  - **Interactivity:** Intentionally non-interactive to focus on visual assembly.
  - **Visuals:** Rendering progress bars and dual-value millisecond timers. Timers are styled as bordered tabs sitting flush against the top of each experience frame (no gap) and are left-aligned.
    - **Timer Format:** Before rendering: `{current}ms`. After rendering starts: `{start} → {current}ms`. The arrow uses standard text color.
    - **FCP Colorization:** The `{start}` value is color-coded by FCP thresholds: **Green** (≤1800ms), **Orange** (≤3000ms), and **Red** (>3000ms).
  - [x] **Completed Fixes:**
    - [x] **Timer Color Sync:** Synced the color of "ms" and arrows with the numeric values.
    - [x] **Realistic Progressive Image Loading:** Simulated top-down packet-based image loading with granular stutter.
    - [x] **Fast Side Corners (#18):** The Fast (right) viewport has its timer tab on the right, so its top-right corner is square (flush with the tab) and its top-left corner is rounded - mirroring the Slow side.

- [x] **Exhibit 2: The Input Abyss (Input Latency).**
  - [x] **Concept:** Visceral experience of delayed interactive feedback (Input Delay).
  - [x] **Fast Side:** Fixed **0ms** latency (Instant feedback).
  - [x] **Slow Side:** Controllable "**Input Latency**" (0-2000ms) via scrubber.
  - [x] **Input Types:**
    - [x] **Buttons:** Visual "pressed" state and action completion (e.g., counter increment).
    - [x] **Text Fields:** Delayed character appearance while typing.
    - [x] **Checkboxes/Radios:** Delayed toggle state change.
  - [x] **Visuals:**
    - [x] Real-time interaction timers showing `{latency}ms`.
    - [x] Ghosting or "pending" states to indicate the input was received but not yet processed.
    - [x] Side-by-side comparison layout following Exhibit 1's pattern.
  - [x] **Interactivity:** Fully interactive elements on both sides to compare the "feel" of lag.
  - [x] **Thresholds:** Latency color-coded: **Green** (≤100ms), **Orange** (≤300ms), **Red** (>300ms) based on standard response time perceptions.
  - [x] **Completed Fixes:**
    - [x] **No Lost Text (#20):** Typed copy must be preserved exactly; latency only delays when it appears. The native input always holds the true value (rendered transparently) while an echo layer paints a delayed copy of value, caret and selection.

- [x] **Exhibit 3: The Layout Leap (Layout Shift).**
  - [x] **Concept:** Experience the "jank" and frustration of Cumulative Layout Shift (CLS).
  - [x] **Mechanics:** A news-article or blog layout where images, ads, or dynamic notices load with artificial delays, causing content to jump.
  - [x] **The "Oops" Moment:** A button (e.g., "Cancel") that moves exactly when the user is about to click it, causing them to click something else (e.g., "Buy Now" or "Delete").
  - [x] **Comparison:**
    - [x] **Stable Side:** Pre-allocated aspect ratios (placeholders) ensure zero shift.
    - [x] **Leaping Side:** Content jumps as assets arrive without reserved space.
  - [x] **Visuals:** CLS score visualization and "jump" highlights.
  - [x] **Thresholds:** CLS color-coded: **Green** (≤0.1), **Orange** (≤0.25), **Red** (>0.25).
  - [x] **Completed Fixes:**
    - [x] **Fixed Height Placeholders:** Updated CSS `height` properties for banners (60px), hero (200px), and sidebar (125px) to ensure predictable space reservation and stability on the Stable side.
    - [x] **Unify Container Sizing:** Ensured both sides use consistent `height` definitions.
    - [x] **Account for Borders:** Aligned `box-sizing` and border styles to prevent 1px shifts.
    - [x] **Fix Hero Image Cropping:** Transitioned hero image to its reserved `200px` height.
    - [x] **Verify Visual Fill:** Confirmed `object-fit: cover` usage for complete container fill.
    - [x] **Suggest Multiple Replays (#21):** Shifts are hard to catch in one go, so the description recommends replaying and a hint appears under the controller after each run ("watched N of 3") until the sequence has been watched 3 times at the current setting. The hint reserves its space (`visibility: hidden`) to avoid layout shift.

- [x] **Exhibit 4: The Unfortunate Shift (Accidental Interaction).**
  - [x] **Concept:** A visceral demonstration of how layout shifts lead to unintended user actions.
  - [x] **Mechanics:** A high-stakes confirmation dialog (e.g., "Delete Account" vs "Cancel").
  - [x] **The Bait-and-Switch:** As the user moves their cursor to click "Cancel", a late-loading element (like a "Pro Tip" or "Notification") pushes the "Cancel" button down, placing the "Delete" button exactly where "Cancel" used to be.
  - [x] **Comparison:**
    - [x] **Stable Side:** Reserved space for the dynamic element ensures buttons never move.
    - [x] **Unfortunate Side:** Zero-height placeholder causes a sudden jump upon loading.
  - [x] **Visuals:**
    - [x] Real-time "Accidental Click" detection.
    - [x] CLS score tracking.
    - [x] A "Replay" mechanism to try again.
  - [x] **Thresholds:** CLS color-coded: **Green** (≤0.1), **Orange** (≤0.25), **Red** (>0.25).

- [x] **Exhibit 5: The Buried Lead (Largest Contentful Paint) (#19).**
  - [x] **Concept:** A slow LCP element defeats the purpose of making it the main content and giving it the most space on the page. Similar to The Slow Starter, but everything except the lead renders on time.
  - [x] **Both Sides:** Start rendering at **500ms**; page chrome (navigation, text, buttons) paints in quick steps right after.
  - [x] **Lead First Side (right):** Fixed LCP of **1000ms** for the image variants. In the headline variant the headline shows immediately, with the first paint (**500ms**).
  - [x] **Buried Lead Side (left):** Controllable "**Time to main content (LCP)**" (1000-8000ms, default 3500ms) via scrubber.
  - [x] **Variants:** A "Main content" picker switches between three pre-rendered mock pages (`LeadPageMock`), in this order (the first one is shown on load):
    - [x] **Marketing carousel:** first slide only, not interactive; arrows and dots render on time over an empty frame.
    - [x] **Headline font:** a text heading that stays invisible until its web font "loads", then appears all at once. The article is a realistic news story where the headline is clearly the most important line (a fictional team winning a championship); no real teams or people.
    - [x] **Product image:** large product photo on a product page.
  - [x] **No Layout Shift:** The lead always has its space reserved; it stays empty until the content arrives.
  - [x] **Image Loading:** Top-down packet-based wipe that completes exactly at the LCP time. The download itself always takes the same **400ms** on both sides and at every setting; a buried lead only starts downloading later.
  - [x] **Visuals:** Timer tabs show `{current}ms` until the lead is rendered, then freeze at `LCP: {lcp}ms`. Progress bars reflect chrome and lead rendering.
  - [x] **Thresholds:** LCP color-coded: **Green** (≤2500ms), **Orange** (≤4000ms), **Red** (>4000ms).
  - [x] **Controls:** Replay and Pause/Resume; switching variants or releasing the scrubber restarts the sequence.
  - [x] **Local Assets:** `public/chronos-campaign.avif` (campaign banner composed from the product photo) and `src/assets/buried-lead.webp` (gallery card, a dark-theme capture of the exhibit) are placeholders that can be replaced with final artwork.

## Phase 3: Advanced Simulations

- [ ] **Exhibit 6: Main Thread Blocking.** Simulation of heavy JavaScript execution freezing the UI.
- [ ] **Exhibit 7: Rendering Jitter.** Artificially dropping frames during animations or scrolling.

## Phase 4: Polish & Education

- [ ] Add "Deep Dive" sidebars for each exhibit explaining the underlying Web Vital.
- [ ] Implement a **Side-by-Side Comparison** layout for every exhibit.
- [x] **Full-Screen Mode (#22):** Every exhibit can be switched to full screen for more immersive replays.
  - [x] **Shared Component:** `FullscreenControls` renders the buttons and owns all logic. It is built into `PerformanceController`; The Unfortunate Shift has no controller and no overlay: each of its four examples has its own full-screen button in a tab on its top edge and goes full screen on its own (the example is marked `data-fullscreen-surface`).
  - [x] **Surface:** The `.exhibit-stage` becomes the full-screen surface, with the controller staying pinned at the bottom. The native Fullscreen API is used where available, with a fixed-position fallback (e.g. iPhone). Esc or the same button exits.
  - [x] **Comparison Toggle:** In full screen only, a "COMPARISON: ON/OFF" button hides the good side so only the slow / broken experience remains at full width. Leaving full screen always restores the comparison.
  - [x] **Convention:** The good side of an exhibit is marked with `data-experience="good"`. Exhibits without a good side (The Input Abyss, The Unfortunate Shift) get full screen without the comparison toggle.
  - [x] **Stability:** The comparison button reserves its space (`visibility: hidden`) outside full screen.
  - [x] **The Buried Lead:** Works in full screen with the comparison toggle for all three variants; the "Main content" picker stays available at the top of the stage. The carousel banner is shown uncropped in full screen.
- [ ] Final visual polish and responsive testing.

## Implementation Guidelines

- **Zero-Layout-Shift:** Initial HTML pre-rendered to prevent layout shifts.
- [x] **Realistic Progressive Image Loading:** Instead of images appearing instantly, simulate a top-to-down "wipe" or scan-line loading effect across all exhibits to mimic low-bandwidth image decoding.
- **No Spinners:** Never use spinners. Use progress bars or text-based indicators. 🚫🌀
- **Loading Progress:** Animate loading bars according to actual asset download progress.
- **Preparation Shield Optimization:** Skip shield if all resources are already loaded/cached.
- **Side-by-Side Layout:** Always place the slower or throttled experience on the left to prioritize user attention on the performance bottleneck.
- **Responsive Design:** Fully responsive supporting mobile and desktop. 📱💻
- **Static First:** All HTML for every exhibit state must be statically generated/pre-rendered.
- **Exhibit Thumbnails:** Gallery card / social images are captures of the exhibit in **dark theme**.
- **Exhibit Descriptions:** Keep them short (two brief paragraphs at most). `ExhibitDescription` renders the HTML directly into its content block, so descriptions may contain their own `<p>` elements without leaving empty paragraphs behind.
- **Inclusive Mock Content:** Mock pages must not use gendered categories (e.g. Men / Women). The Chronos store navigation is Collections / Sport / Classic.
- **Docked Controls:** The controls overlay is docked flush to the bottom edge of the screen (`position: sticky; bottom: 0`), never floating above it. It stays attached all the way to the end of the page (no padding below it) and on pages shorter than the screen. The `PerformanceController` is a compact bar: a single row on wide screens (label and replay, scrubber, value, full-screen buttons) and two rows on narrow ones, so it covers as little of the exhibit as possible. The Layout Leap controller spans the full stage width, because its CLS snap points sit close together and need a longer scrubber.
- **No Tailwind:** Use Vanilla CSS for precise control.
- **Code Styling:** Prettier is used for consistent formatting.

## Workflow Protocol

1. **Research & Plan:** Present walkthrough of requirements before starting implementation.
2. **Document Requirements:** **ALWAYS** update this `AGENTS.md` file with new requirements first.
3. **Review:** Allow user feedback before proceeding.
4. **Branching & Progress Tracking:**
   - Pull `main` from GitHub before starting (`git pull origin main`).
   - Create feature branch named after the step.
   - Use Markdown checkboxes to track progress.
5. **Execution:** **ONLY** proceed once the user has explicitly stated "ready."
6. **Commits & GitHub Pull Requests:**
   - **Format Code:** Run `npm run format` before every commit.
   - Commit changes incrementally.
   - Create a Pull Request (PR) for each feature branch.
   - **Document PRs:** Update PR description with full documentation on every push.
   - **Preview URLs:** Include link: `https://[branch-name]-ux-speed-museum.sergeychernyshev.workers.dev`.
   - **Merging:** Merge via GitHub PR **ONLY** when user says "let's merge."
7. **Validation:** Verify behavioral and stylistic correctness after each step.
8. **Communication:** Use very few emojis. 📝

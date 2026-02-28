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
- [x] Implement the `PerformanceController` component for real-time manipulation.
  - [x] **Integrated REPLAY Button:** Moved the REPLAY button into the `PerformanceController` header.
    - [x] **Smart Visibility & Stability:** Button only appears after initial playback is complete and disables itself during playback. It uses `visibility: hidden` to avoid layout shifts in the header.
    - [x] **Infinite Loop Prevention:** Events are now flagged with a `source` to distinguish between manual scrubber releases and automated simulation completions.

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
  - [ ] **Pending Fixes:**
    - [ ] **Timer Color Sync:** Ensure the "ms" unit and the arrow in the timer display share the same color-coding as the numeric value (Green/Orange/Red) during the rendering sequence.
    - [x] **Realistic Progressive Image Loading:** Instead of images appearing instantly, simulate a top-to-down "wipe" or scan-line loading effect to mimic low-bandwidth image decoding.

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

- [ ] **Exhibit 4: Network Throttle (LCP & Sequential Loading).**
  - **Concept:** Experience the psychological difference between progressive loading on slow networks vs. high-bandwidth connections.
  - **Fast Side:** Fixed "Fiber" speed (Instant/Near-instant).
  - **Slow Side:** Controllable "Network Profile" (2G, 3G, Slow 4G) via scrubber or discrete selector.
  - **Mechanics:**
    - A social media feed or photo gallery layout.
    - Resources (images, text, profile avatars) load sequentially based on simulated bandwidth and latency.
    - **The "Waterfall" Effect:** Visualize the queue of resources loading one by one.
  - **Content:** 
    - 5-6 social media posts with different asset sizes.
    - Images should use simulated progressive loading.
  - **Visuals:**
    - LCP timer and highlight on the largest image.
    - Per-resource progress bars showing "Downloading..."
    - RTT (Round Trip Time) indicator and current download speed (e.g., "50 kbps").
  - **Thresholds:** LCP color-coded: **Green** (≤2500ms), **Orange** (≤4000ms), **Red** (>4000ms).

## Phase 3: Advanced Simulations

- [ ] **Exhibit 5: Main Thread Blocking.** Simulation of heavy JavaScript execution freezing the UI.
- [ ] **Exhibit 6: Rendering Jitter.** Artificially dropping frames during animations or scrolling.

## Phase 4: Polish & Education

- [ ] Add "Deep Dive" sidebars for each exhibit explaining the underlying Web Vital.
- [ ] Implement a **Side-by-Side Comparison** layout for every exhibit.
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

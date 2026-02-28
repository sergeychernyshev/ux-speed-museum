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

- [ ] **Exhibit 2: The Input Abyss (Input Latency).**
  - **Concept:** Visceral experience of delayed interactive feedback (Input Delay).
  - **Fast Side:** Fixed **0ms** latency (Instant feedback).
  - **Slow Side:** Controllable "**Input Latency**" (0-2000ms) via scrubber.
  - **Input Types:**
    - **Buttons:** Visual "pressed" state and action completion (e.g., counter increment).
    - **Text Fields:** Delayed character appearance while typing.
    - **Checkboxes/Radios:** Delayed toggle state change.
  - **Visuals:** 
    - Real-time interaction timers showing `{latency}ms`.
    - Ghosting or "pending" states to indicate the input was received but not yet processed.
    - Side-by-side comparison layout following Exhibit 1's pattern.
  - **Interactivity:** Fully interactive elements on both sides to compare the "feel" of lag.
  - **Thresholds:** Latency color-coded: **Green** (≤100ms), **Orange** (≤300ms), **Red** (>300ms) based on standard response time perceptions.

- [ ] **Exhibit 3: Network Throttle.** A mock data-fetching interface simulating 2G, 3G, and "Slow 4G" speeds.
- [ ] **Exhibit 4: Layout Shift.** A news-style layout demonstrating CLS via delayed asset loading.

## Phase 3: Advanced Simulations

- [ ] **Exhibit 5: Main Thread Blocking.** Simulation of heavy JavaScript execution freezing the UI.
- [ ] **Exhibit 6: Rendering Jitter.** Artificially dropping frames during animations or scrolling.

## Phase 4: Polish & Education

- [ ] Add "Deep Dive" sidebars for each exhibit explaining the underlying Web Vital.
- [ ] Implement a **Side-by-Side Comparison** layout for every exhibit.
- [ ] Final visual polish and responsive testing.

## Implementation Guidelines

- **Zero-Layout-Shift:** Initial HTML pre-rendered to prevent layout shifts.
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

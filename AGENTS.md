# Project Roadmap: UX Speed Museum

This document outlines the architectural strategy and implementation phases for the UX Speed Museum.

## Architectural Vision

The application is built as a multi-page site using Astro in **SSR (Server-Side Rendering) mode**. This allows the server to read user preference cookies (audio, animation, collapse state) and render the initial HTML accordingly, ensuring a zero-layout-shift (CLS) experience. Each exhibit is a self-contained page where all potential states (hidden or visible) are pre-rendered.

### Navigation & Loading Strategy

- **Custom Domain:** The project is hosted on `museum.uxspeed.dev`.
- **Pre-fetch on Intent:** Use Astro's pre-fetching mechanisms (hover/tap) to warm up the browser cache.
- **The Preparation Shield:** An inline component positioned under the exhibit description that shows a "preparing your experience" state until all resources are ready.
- **State Persistence:** User preferences are stored in cookies and applied during server-side rendering.

## Phase 1: Foundation (Scaffolding)

- [x] Initialize Astro + TypeScript project (**Cloudflare Workers SSR mode**).
- [x] Establish a "Vanilla CSS" design system with **Light and Dark mode** support.
- [x] Implement cookie-based preference management (audio, animation, collapse).
- [x] Create an `ExhibitLayout.astro` component with inline **Preparation Shield** logic.
- [x] Implement the `ExhibitDescription` component:
  - [x] Progressive sentence reveal animation.
  - [x] Audio narration system with enable/disable toggle.
  - [x] Visible audio narration playback controls.
  - [x] Conditional preloading of audio.
  - [x] Controls to stop animation and collapse the section.
- [x] Implement the `PerformanceController` component for real-time manipulation.

## Phase 2: Core Exhibits (MVP)

- [x] **Exhibit 1: The Slow Starter.**
  - **Concept:** Progressive rendering of a realistic e-commerce product page.
  - **Fast Side:** Starts rendering at **500ms** (CrUX FCP P5 baseline).
  - **Slow to Start Side:** Controllable "**Time to start rendering**" (500-5500ms) via scrubber.
  - **Scrubbing Logic:**
    - When the user starts scrubbing, both views hide their content and timers immediately.
    - Backgrounds remain unchanged during scrubbing.
    - When the user stops scrubbing, the rendering sequence restarts and timers are revealed.
  - **Content:** Realistic Navigation, Hero, Image, Details, and Footer.
  - **Animation:** Staggered 11-step paint sequence.
  - **Interactivity:** Intentionally non-interactive to focus on visual assembly.
  - **Visuals:** Rendering progress bars and dual-value millisecond timers ({start} - {current}ms). Timers are visually attached to the top-left of each experience frame. The start value is color-coded by FCP thresholds (Green <= 1800ms, Orange <= 3000ms, Red > 3000ms).

- [ ] **Exhibit 2: The Input Abyss (Input Latency).**
  - [ ] Create sub-pages for: Buttons, Text Fields, Checkboxes, and Radio Buttons.
  - [ ] Implementation: Display a range of inputs (e.g., 0ms to 2000ms latency) on the same screen.
  - [ ] Scrubbing logic: Use the scrubber to highlight/enable the input corresponding to the chosen latency level.

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

- **Zero-Layout-Shift SSR:** All user preferences rendered on the server based on cookies.
- **No Spinners:** Never use spinners. Use progress bars or text-based indicators. 🚫🌀
- **Loading Progress:** Animate loading bars according to actual asset download progress.
- **Preparation Shield Optimization:** Skip shield if all resources are already loaded/cached.
- **Responsive Design:** Fully responsive supporting mobile and desktop. 📱💻
- **Static First:** All HTML for every exhibit state must be statically generated/pre-rendered.
- **No Tailwind:** Use Vanilla CSS for precise control.
- **Code Styling:** Prettier is used for consistent formatting (`.astro`, `.jsonc`, etc.).

## Workflow Protocol

1. **Research & Plan:** Present walkthrough of requirements before starting implementation.
2. **Document Requirements:** **ALWAYS** update this `AGENTS.md` file with new requirements first.
3. **Review:** Allow user feedback before proceeding.
4. **Branching & Progress Tracking:**
   - Pull `main` from GitHub before starting (`git pull origin main`).
   - Create feature branch named after the step (e.g., `feature/exhibit-2-input-abyss`).
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

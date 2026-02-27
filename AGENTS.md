# Project Roadmap: UX Speed Museum

This document outlines the architectural strategy and implementation phases for the UX Speed Museum.

## Architectural Vision

The application will be built as a multi-page site using Astro in **SSR (Server-Side Rendering) mode**. This allows the server to read user preference cookies (audio, animation, collapse state) and render the initial HTML accordingly, ensuring a zero-layout-shift (CLS) experience. Each "exhibit" remains a self-contained page where all potential states (hidden or visible) are pre-rendered.

### Navigation & Loading Strategy

- **Custom Domain:** The project is hosted on `museum.uxspeed.dev`.
- **Pre-fetch on Intent:** Use Astro's pre-fetching mechanisms (hover/tap) to warm up the browser cache.
- **The Preparation Shield:** A script in the `<head>` of the `ExhibitLayout.astro` will show a "We are preparing your experience" message, hiding the exhibit until `window.onload` or a custom "assets-ready" event fires. This ensures the museum's performance is flawless before the _simulated_ slowness begins.
- **State Persistence:** User preferences are stored in cookies and applied during server-side rendering.

## Phase 1: Foundation (Scaffolding)

- [x] Initialize Astro + TypeScript project (**Cloudflare Workers SSR mode**).
- [x] Establish a "Vanilla CSS" design system focused on a museum-like aesthetic (clean, minimalist, focused), supporting both **Light and Dark modes** via `prefers-color-scheme`.
- [x] Implement cookie-based preference management (audio, animation, collapse).
- [x] Create an `ExhibitLayout.astro` component to provide a consistent frame, including the **Preparation Shield** logic and server-side application of user preferences from cookies.
- [x] Implement the `ExhibitDescription` component:
  - [x] Progressive sentence reveal animation (honoring `prefers-reduced-motion`).
    - [x] Audio narration system with enable/disable toggle.
    - [ ] Visible audio narration playback controls (play/pause/progress).
    - [x] Conditional preloading: Do not fetch audio if narration is disabled.
    - [ ] Ensure narration is audible and triggered appropriately during the exhibit reveal.
    - [x] Controls to stop animation and collapse the section.- [x] Implement the `PerformanceController` component (client-side script targeting pre-rendered HTML) for real-time manipulation.

## Phase 2: Core Exhibits (MVP)

- [ ] **Exhibit 1: The Slow Starter.** A simulation of a slow initial page load/hydration. Users can dial in the delay before the app becomes interactive.
- [ ] **Exhibit 2: The Input Abyss (Input Latency).**
  - [ ] Create sub-pages for: Buttons, Text Fields, Checkboxes, and Radio Buttons.
  - [ ] Implementation: Instead of side-by-side, display a range of inputs (e.g., 0ms to 2000ms latency) on the same screen.
  - [ ] Scrubbing logic: Use the `PerformanceController` scrubber to highlight/enable the input corresponding to the chosen latency level.
- [ ] **Exhibit 3: Network Throttle.** A mock data-fetching interface where users can simulate 2G, 3G, and "Slow 4G" speeds with artificial request queuing.
- [ ] **Exhibit 4: Layout Shift.** A news-style layout where images and ads load at different, controllable intervals to demonstrate CLS (Cumulative Layout Shift).

## Phase 3: Advanced Simulations

- [ ] **Exhibit 5: Main Thread Blocking.** A simulation of heavy JavaScript execution (e.g., complex sorting) that freezes the UI, allowing users to see the impact of Long Tasks.
- [ ] **Exhibit 6: Rendering Jitter.** Artificially dropping frames during animations or scrolling to demonstrate the importance of 60fps.

## Phase 4: Polish & Education

- [ ] Add "Deep Dive" sidebars for each exhibit explaining the underlying Web Vital (LCP, FID/INP, CLS).
- [ ] Implement a **Side-by-Side Comparison** layout for every exhibit, ensuring "Optimized" and "Throttled" states are perfectly synchronized for comparison.
- [ ] Final visual polish and responsive testing.

## Implementation Guidelines

- **Zero-Layout-Shift SSR:** All user preferences (collapsed state, etc.) must be rendered on the server based on cookies to prevent layout shifts.
- **Accessibility & Motion:** All animations must respect `prefers-reduced-motion`. Narrative audio must be togglable and its preloading must be conditional to save bandwidth when disabled.
- **No Spinners:** Never use spinners anywhere in the UI. Use alternative indicators like progress bars or text-based loading states.
- **Loading Progress:** Animate loading bars according to actual asset download progress. Do not apply CSS progress animations if the loading shield is not shown.
- **Responsive Design:** The UI must be fully responsive, supporting both desktop resolutions and mobile browsers through adaptive layouts (e.g., stacking sidebars on mobile).
- **Static First:** All HTML for every exhibit state must be statically generated/pre-rendered. Use CSS (e.g., `display: none` or `visibility: hidden`) for initial state management rather than client-side conditional rendering.
- **No Tailwind:** Use Vanilla CSS to ensure we can manipulate the box model and transitions without framework interference.
- **Code Styling:** Prettier is used for consistent code formatting across the project, including support for `.astro` and `.jsonc` files.
- **Accessibility:** Ensure the "museum" is accessible even when the exhibits are "broken" by design.
- **Performance:** Ironically, the app itself must be highly performant to ensure the _simulated_ slowness is accurate and predictable.

## Workflow Protocol

1. **Research & Plan:** For each exhibit or major feature, first present a detailed walkthrough of the requirements and implementation strategy.
2. **Document Requirements:** **ALWAYS** update this `AGENTS.md` file with any new requirements, constraints, or architectural decisions provided by the user before starting implementation.
3. **Review:** Allow the user to modify requirements or provide feedback.
4. **Branching & Progress Tracking:**
   - Always pull `main` from GitHub before starting a new step (`git pull origin main`).
   - **DO NOT** start any new steps or create new feature branches until all existing Pull Requests are merged and closed.
   - Create a new git branch for each step named after the step (e.g., `feature/phase-1-scaffolding`).
   - Use Markdown checkboxes in `AGENTS.md` to track and persist progress between sessions.
5. **Execution:** **ONLY** proceed with implementation on the feature branch once the user has explicitly stated they are "ready" or given the green light.
6. **Commits & GitHub Pull Requests:**
   - **Format Code:** Run `npm run format` before every commit to ensure consistent code styling according to Prettier.
   - Commit changes incrementally as they are implemented.
   - Create a Pull Request (PR) on GitHub for each feature branch.
   - **Document PRs:** Every time a new commit is pushed to a PR, the PR description must be updated with comprehensive documentation of all changes and features implemented in that PR.
   - **Preview URLs:** Every PR must include a branch preview URL in the format `https://[branch-name]-ux-speed-museum.sergeychernyshev.workers.dev`.
   - **Automated Deployment:** Deployment to Cloudflare is handled automatically upon pushing changes to the branch/PR. Manual deployment is not required.
   - **Merging:** When the user says "let's merge", the current PR must be merged into the `main` branch and then closed. Merge into the `main` branch **ONLY** via GitHub PR after review and final confirmation.
7. **Validation:** Verify behavioral and stylistic correctness after each step.
8. **Communication:** Use very few emojis when communicating progress and updates. 📝

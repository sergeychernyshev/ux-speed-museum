# UX Speed Museum

The **UX Speed Museum** is an interactive, educational platform designed to help developers, designers, and product managers experience the visceral impact of performance bottlenecks. By providing a controlled environment where users can "dial in" various forms of slowness, the museum transforms abstract metrics like LCP or input latency into tangible, felt experiences.

## The Mission
To build empathy for users on slow devices or poor networks by making the "invisible" friction of bad performance impossible to ignore.

## Exhibits
- **The Slow Starter:** Feel the agonizing wait of a slow-loading application with controllable initial hydration and rendering delays.
- **The Latency Labyrinth:** Experience varying degrees of network request delays and their impact on UI responsiveness.
- **The Jitter Junction:** Feel the frustration of inconsistent frame rates and scroll stutter.
- **The Layout Leap:** Observe how delayed asset loading causes disruptive layout shifts.
- **The Input Abyss:** Experience the "mud" of input latency across various interactive elements (buttons, text fields, checkboxes, radio buttons). Unlike other exhibits, this one shows a range of latencies on one screen, with the "active" input highlighted via a speed scrubber.
- **The Throttled Theater:** Watch media playback with simulated bandwidth constraints and buffer bloat.

## Architectural Approach
- **Multi-Page Exhibits:** Each exhibit resides on its own statically generated page.
- **Aggressive Pre-loading:** The museum uses `data-astro-prefetch` and custom "click-to-load" strategies to start resource fetching as soon as the user interacts with navigation links.
- **Preparation Shield:** A "We are preparing your experience" overlay ensures that all required assets (scripts, images, styles, and optional audio) are fully loaded and ready before any simulation is presented.
- **Persistent Multi-Modal Descriptions:** Each exhibit features an animated description that reveals sentences progressively (respecting `prefers-reduced-motion`) and provides synchronized audio narration. User preferences for audio, animation, and section collapse are persisted via cookies and rendered on the server (SSR) to eliminate layout shifts. Audio assets are only preloaded if narration is enabled.

## Tech Stack
- **Frontend:** Astro (TypeScript)
- **Styling:** Vanilla CSS with full support for `prefers-color-scheme` (Light/Dark modes).
- **State Management:** Native Web APIs / Nanostores (for client-side reactivity)
- **Simulation Engine:** Statically generated HTML with client-side scripts and Astro components for controlled performance degradation. Exhibits are presented in a **Side-by-Side Comparison** layout, where the "Optimized" and "Throttled" versions are visible simultaneously for immediate impact assessment.

## Getting Started
(Detailed setup instructions will be added as implementation progresses.)

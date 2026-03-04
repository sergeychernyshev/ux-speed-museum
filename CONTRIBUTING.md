# Contributing to UX Speed Museum

Thank you for your interest in contributing to the UX Speed Museum! This project aims to build empathy for users on slow devices through visceral, interactive experiences.

## Development Lifecycle

We operate using a **Research -> Strategy -> Execution** lifecycle for every task.

- **AI-Assisted Workflow:** This project leverages **Google Gemini** for strategic orchestration. All foundational mandates and implementation phases are documented in `AGENTS.md`.
- **Roadmap Management:** Contributors should update `AGENTS.md` with new requirements and track progress using the provided checkboxes.

## Engineering Standards

- **Static First:** All HTML for every exhibit state must be statically generated/pre-rendered (SSG mode).
- **Zero-Layout-Shift:** Avoid layout shifts during hydration. Reserved space for dynamic elements is mandatory.
- **Vanilla CSS:** Use Vanilla CSS for precise control. Avoid TailwindCSS unless specifically requested.
- **No Spinners:** Never use spinners. Use progress bars or text-based indicators. 🚫🌀
- **Testing:** Every change should include a verification strategy (automated tests or manual validation steps).

## Branching & Pull Requests

- Pull `main` before starting (`git pull origin main`).
- Create a feature branch named after the task (e.g., `feat/new-exhibit`).
- Run `npm run format` before every commit.
- Create a Pull Request (PR) for each feature branch.
- Document PRs with full technical rationale and preview URLs.

## Project Structure

```text
/
├── public/          # Static assets (favicons, global images)
├── src/
│   ├── assets/      # Exhibit-specific images/assets
│   ├── components/  # Reusable Astro components
│   ├── layouts/     # Page layouts
│   ├── pages/       # Exhibit pages and homepage
│   └── styles/      # Global CSS
└── package.json
```

## Architectural Guidelines

- **Side-by-Side Comparison:** Always place the slower or throttled experience on the left to prioritize user attention on the performance bottleneck.
- **Preparation Shield:** Use the inline Preparation Shield logic to ensure assets are ready before the simulation starts.
- **Progressive Image Loading:** Mimic low-bandwidth image decoding with top-to-down "wipe" effects where appropriate.

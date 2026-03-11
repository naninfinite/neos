# Stage 1A — Shell Scaffold

## What we were trying to do

Turn the fresh repo from a generic Vite starter into the first recognisable version of NEOS.

## What changed

- Created the new rebuild repository
- Added the spec-first documentation set
- Added root guidance files such as `README.md` and `AGENTS.md`
- Replaced the default Vite demo with a minimal NEOS placeholder shell
- Added the first source folder structure for the future runtime

## Why this matters

This is the point where the project stopped being a starter template and became a real product foundation.

It established:
- the new implementation target
- the document authority order
- the first visible shell identity
- the initial place where the runtime will grow

## In plain English

This step was like taking over an empty building and putting up the first walls, sign, and floor plan.

Before this, the project was just a starter kit.

After this, it became the beginning of a real system with a name, structure, and direction.

## What the UI looked like

At this stage, the app shows a simple shell bootstrap screen instead of the default Vite counter demo.

This is intentional.

The goal was not to build the operating system yet, but to replace the starter placeholder with one that belongs to the project.

![Stage 1A shell home](../assets/01-stage-1a/shell-home.png)

## Important code

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <section className="boot-panel">
        <p className="boot-label">NEOS</p>
        <h1 className="boot-title">Shell bootstrap</h1>
        <p className="boot-copy">
          Runtime scaffold initialised. Windowing, services, and apps will be
          mounted here.
        </p>
      </section>
    </main>
  );
}

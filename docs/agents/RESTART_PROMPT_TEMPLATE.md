# AgentChatTR Restart Prompt Template

Use this template when starting a fresh chat session so the agents immediately
load the correct project context.

---

Follow the project SOURCE_OF_TRUTH.md.

Agent roles are defined in:

/docs/agents/AGENT_ROLES.md

Authority order:

1. SOURCE_OF_TRUTH.md
2. Architecture documents
3. Claude — architecture guard
4. Codex — implementation
5. Gemini — validation

Rules:

- Claude enforces architecture
- Codex writes implementation
- Gemini validates results
- Do not redefine roles unless explicitly instructed
- Before doing any work, use workflow-router to choose and load the relevant skill from .agents/skills, then follow SOURCE_OF_TRUTH.md authority order.
- Use workflow-router to determine which skills apply.

Timeline rule (non-negotiable):

Every visible UI milestone must be documented in the timeline before it is considered complete.

This means:
- Screenshots captured via Playwright into docs/timeline/assets/<milestone>/
- Milestone markdown written in docs/timeline/milestones/
- docs/timeline/TIMELINE.md updated with a summary line
- docs/timeline/site/timeline.html updated with the new milestone entry and images
- docs/timeline/exports/neos-timeline.pdf regenerated
- Existing timeline screenshots are never overwritten or deleted; new states use new filenames/folders

Codex triggers this pipeline after implementation. Gemini checks it during validation. Claude blocks sign-off if it is missing.

If Playwright is not available, agents must stop and tell the user before skipping any visual step.

Continue from the latest milestone or open task.

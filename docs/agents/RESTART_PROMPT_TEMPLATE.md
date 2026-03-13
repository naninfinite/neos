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

Continue from the latest milestone or open task.


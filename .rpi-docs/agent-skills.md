# 2. Agent Skills

Agent Skills are folders containing instructions, scripts, and resources that allow Copilot to perform specialized tasks. They adhere to the open standard [agentskills.io](https://agentskills.io).

## 2.1 Overview
* **Purpose:** Teach specialized capabilities (e.g., "Web App Testing") rather than just coding guidelines.
* **Portability:** Works across VS Code, Copilot CLI, and Copilot Coding Agent.
* **Loading:** Uses "Progressive Disclosure" to save context (Discovery → Instructions → Resources).

## 2.2 Directory Structure
Skills are stored in specific directories. Each skill requires its own subdirectory.

### Locations
* **Project Skills:** `.github/skills/` (Recommended) or `.claude/skills/`.
* **Personal Skills:** `~/.copilot/skills/` (Recommended) or `~/.claude/skills/`.
* **Custom Locations:** Configurable via `chat.agentSkillsLocations`.

### Structure Example
```
.github/skills/webapp-testing/
├── SKILL.md           # Metadata and instructions
├── test-template.js   # Resource file
└── examples/          # Example scenarios
```

## 2.3 `SKILL.md` Format
The definition file must be named `SKILL.md`.

### Header
```yaml
---
name: webapp-testing
description: Generates and runs tests for web applications using Jest.
---
```
* `name`: Unique ID (lowercase, hyphens). Max 64 chars.
* `description`: Capabilities and use cases. Max 1024 chars. **Critical for discovery.**

### Body
Contains detailed instructions, step-by-step procedures, and references to local resources (e.g., `[test script](./test-template.js)`).

## 2.4 Comparison: Skills vs. Custom Instructions

| Feature         | Agent Skills                         | Custom Instructions                   |
| :-------------- | :----------------------------------- | :------------------------------------ |
| **Purpose**     | Specialized capabilities & workflows | Coding standards & style guidelines   |
| **Content**     | Instructions + Scripts + Resources   | Instructions only                     |
| **Scope**       | Task-specific, loaded on-demand      | Always applied (or via glob patterns) |
| **Portability** | Cross-tool (CLI, Agents, VS Code)    | VS Code & GitHub.com only             |

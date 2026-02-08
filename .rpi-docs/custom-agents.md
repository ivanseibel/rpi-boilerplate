# 1. Custom Agents in VS Code

Custom agents allow users to configure AI personas tailored to specific development roles (e.g., "Planner," "Security Reviewer") with distinct behaviors, tools, and instructions.

## 1.1 Overview
* **Purpose:** To create tailored chat experiences that switch context, tools, and instructions automatically.
* **Behavior:** Agents can be read-only (for research), full-access (for implementation), or specialized for specific workflows.
* **Availability:** Introduced in VS Code release 1.106.

## 1.2 File Structure (`.agent.md`)
Custom agents are defined in markdown files with the `.agent.md` extension.

### Location
* **Workspace Level:** `.github/agents/` (for project-specific use).
* **User Profile:** Current profile folder (for cross-workspace use).
* **Organization Level:** Defined at the GitHub organization level (if enabled via `github.copilot.chat.organizationCustomAgents.enabled`).

### YAML Frontmatter Configuration
The file header defines metadata and behavior:

```yaml
---
name: implementation-agent
description: Generate code based on plans
tools: ['search', 'fetch']
model: GPT-5.2 (copilot)
user-invokable: true
disable-model-invocation: false
handoffs:
  - label: Start Review
    agent: code-reviewer
    prompt: Review the code generated above for security issues.
    send: false
---
```

| Field            | Description                                                                           |
| :--------------- | :------------------------------------------------------------------------------------ |
| `name`           | Unique identifier. Defaults to filename if omitted.                                   |
| `description`    | displayed as placeholder text in the chat input.                                      |
| `tools`          | List of tools/toolsets available (e.g., `search`, `fetch`, or `<mcp-server-name>/*`). |
| `model`          | Specific AI model or array of models to try in order.                                 |
| `agents`         | List of allowed subagents. Use `*` for all or `[]` for none.                          |
| `handoffs`       | Workflow transitions to other agents (see Section 1.3).                               |
| `user-invokable` | `true` (default) shows agent in dropdown; `false` hides it (subagent only).           |

### Body Content
The markdown body contains specific prompts and guidelines prepended to the user chat context.
* **Tool Referencing:** Use `#tool:<tool-name>` (e.g., `#tool:githubRepo`).
* **File Referencing:** Standard markdown links.

## 1.3 Handoffs
Handoffs enable sequential workflows by suggesting the next agent after a response completes.
* **Function:** Displays interactive buttons to switch agents with context.
* **Configuration:** Defined in frontmatter under `handoffs`.
  * `label`: Button text.
  * `agent`: Target agent identifier.
  * `prompt`: Pre-filled text for the next step.
  * `send`: If `true`, auto-submits the prompt.

## 1.4 Managing Agents
* **Creation:** Use "Chat: New Custom Agent" command or manually create `.agent.md` files.
* **Visibility:** Toggle visibility in the agents dropdown via "Configure Custom Agents" (eye icon).
* **Prioritization:** Tool availability priority is: Prompt File > Referenced Custom Agent > Default Agent Tools.

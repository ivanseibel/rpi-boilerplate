# 3. Custom Instructions

Custom instructions define common guidelines (e.g., coding style, linter rules) that automatically influence AI generation.

## 3.1 Types of Instruction Files

### A. Global Workspace Instructions (`.github/copilot-instructions.md`)
* **Scope:** Applies to **all** chat requests in the workspace.
* **Location:** Root of workspace.
* **Requirement:** Enable `github.copilot.chat.codeGeneration.useInstructionFiles`.

### B. Context-Specific Instructions (`*.instructions.md`)
* **Scope:** Applies conditionally based on file focus or manual attachment.
* **Location:** `.github/instructions/` (default) or user profile.
* **Frontmatter:**
```yaml
---
applyTo: "**/*.py" 
---
```
* `applyTo`: Glob pattern for auto-application. If omitted, file must be added manually via "Add Context".

### C. Agent-Wide Instructions (`AGENTS.md`)
* **Scope:** Applies to all agents in the workspace.
* **Nested Support:** Experimental support for nested `AGENTS.md` in subfolders (enable `chat.useNestedAgentsMdFiles`) allows folder-specific instruction injection.

## 3.2 Configuration & Hierarchy
* **Settings-Based Instructions:** Can be defined directly in `settings.json` (e.g., `github.copilot.chat.reviewSelection.instructions`), though file-based approaches are recommended.
* **Organization Level:** Shared across teams if defined at GitHub Org level and `github.copilot.chat.organizationInstructions.enabled` is true.

## 3.3 Best Practices
* **Simplicity:** Keep instructions short and self-contained.
* **Modularity:** Use multiple `.instructions.md` files with `applyTo` patterns rather than one massive file.
* **Verification:** Use the "Chat Customization Diagnostics" view to verify which instructions are loaded.

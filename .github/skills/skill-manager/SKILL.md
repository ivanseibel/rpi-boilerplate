---
name: skill-manager
description: Create and edit Agent Skills (SKILL.md, references, assets) following the Agent Skills specification and VS Code usage guidance.
---

# Skill Manager

## When to use this skill

Use this skill when creating a new Agent Skill or editing an existing one so the result matches the Agent Skills format, folder layout, and progressive disclosure model.

## Steps

1. Choose a specific, action-oriented skill directory name and set the same value in the frontmatter name field.
2. Draft a specific description that states what the skill does and when to use it.
3. Create the skill folder under .github/skills (preferred) or ~/.copilot/skills for personal use.
4. Add SKILL.md with clear sections for when-to-use, steps, examples, and edge cases.
5. Move heavy content into references/ or assets/ and link them from SKILL.md.
6. Keep SKILL.md under 500 lines and avoid deep reference chains.

## Authoring checklist

- Frontmatter name is lowercase, 1-64 chars, hyphenated, no leading/trailing hyphen, no consecutive hyphens.
- Name is descriptive and domain-prefixed (avoid generic names like "guidelines"); example: "github-actions-failure-debugging".
- Frontmatter description is 1-1024 chars and states both capability and use cases.
- Optional fields are used only when needed: license, compatibility, metadata, allowed-tools.
- References use relative paths from the skill root and stay one level deep.
- The skill focuses on one coherent capability and uses progressive disclosure.

## Resources

- Spec summary: references/skill-spec-summary.md
- Examples: references/skill-examples.md
- Template: assets/skill-template.md

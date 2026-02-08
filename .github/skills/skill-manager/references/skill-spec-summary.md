# Agent Skills Spec Summary

## Core structure

A skill is a directory containing SKILL.md. Optional folders are scripts/, references/, and assets/.

## SKILL.md frontmatter

Required fields:
- name: 1-64 chars, lowercase letters, numbers, hyphens; no leading/trailing hyphen; no consecutive hyphens; must match directory name.
- description: 1-1024 chars; describe what the skill does and when to use it.

Optional fields:
- license: short license name or bundled license file reference.
- compatibility: 1-500 chars; include only for specific environment requirements.
- metadata: map of string key/value pairs.
- allowed-tools: space-delimited list of pre-approved tools (experimental).

## Body guidance

- Use clear sections: when to use, steps, examples, edge cases.
- Keep SKILL.md under 500 lines; move heavy details to references/ or assets/.

## Progressive disclosure

1. Discovery: name and description are loaded at startup.
2. Activation: SKILL.md body loads when relevant.
3. Resources: references/assets load only when linked.

## File references

- Use relative paths from the skill root.
- Keep reference chains shallow and one level deep.

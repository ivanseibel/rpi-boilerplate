# Research Phase Prompt

**Purpose:** Initiate the Research phase of the RPI workflow to gather facts and establish technical constraints.

**Input:** `.rpi/<project-id>/research.md` (to be created)

## Instructions

Conduct read-only exploration to answer the problem statement. Your research must:

1. **Cite all sources** - Use inline parenthetical references (e.g., `source.md — Section 2`)
2. **No solution proposals** - Document what exists, not what should be built
3. **Identify unknowns** - Explicitly list runtime assumptions or unverified capabilities
4. **Validate against FAR** - Ensure research is Factual, Actionable, Relevant

## Output Structure

Produce `research.md` with these sections:

- Problem Statement Analysis
- Conceptual Scope
- System Constraints
- Existing Patterns and Exemplars
- Validation — FAR Criteria
- Notes on Unknowns

## Handoff

Research is complete when `research.md` exists, passes FAR validation, and the Planner acknowledges receipt.

---

**Example invocation:**

```
Start Research phase for project "implement-feature-x".

Problem statement: Implement feature X that integrates with system Y.

Requirements:
- Research Y's API capabilities and constraints
- Identify existing integration patterns in the codebase
- Document technical limitations or unknowns

Output: .rpi/0002-implement-feature-x/research.md
```

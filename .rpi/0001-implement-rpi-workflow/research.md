# Research: Implement RPI Workflow in VSCode

## 1. Problem Statement Analysis

- Trigger: The repository's stated initiative is to "Implement a complete RPI workflow inside VSCode using Custom Agents, Custom Instructions, Skills." (Source: docs/The RPI Pattern_ A Research Study.md — Intro & Section 5).

  (Source: docs/The RPI Pattern_ A Research Study.md — "The goal of the overall initiative is: Implement a complete RPI workflow inside VSCode using: • Custom Agents • Custom Instructions • Skills" and Section 5.)

- Real underlying intent: Encode RPI's three-phase operational pattern (Research → Plan → Implement) as an executable, agent-driven workflow within VSCode so that agents and skill artifacts drive disciplined phase transitions. (Source: docs/The RPI Pattern_ A Research Study.md — Sections 1, 5; docs/RPI Phase I_ Epistemology and Research Protocol.md — Title and Section 1).

  (Source: docs/The RPI Pattern_ A Research Study.md — "RPI functions as a formal separation of concerns between information gathering (Epistemology), strategy formulation (Decision Theory), and execution (Operationalization)")

- Ambiguities discovered during research (explicitly noted as unknown where not stated):
  - The repository docs define required artifact names and high-level behaviors (e.g., `research.md`, `plan.md`, `plan.md` verification gates) but do not specify an exact canonical file path or repository-enforced naming convention for the VS Code Custom Agent files beyond examples and recommendations. (Source: docs/RPI Phase I_ Epistemology and Research Protocol.md — "The Research Artifact (research.md)" and docs/custom-agents.md — Section 1.2 "Location" and examples.)
  - The docs reference settings and feature flags (e.g., `github.copilot.chat.organizationCustomAgents.enabled`) but do not enumerate the exact VS Code product versions or delivery mechanism that will enforce them in this repository. (Source: docs/custom-agents.md — Section 1.2; docs/custom-instructions.md — Section 3.1.)

  (Marked Unknown: specific enforcement mechanism and exact repo-level naming conventions where multiple recommended locations are given.)

## 2. Conceptual Scope (Blast Radius)

- Relevant RPI phases and responsibilities (as documented):
  - Research (Epistemology): Acquire valid knowledge; produce `research.md` artifact; enforce read-only and citation rules. (Source: docs/RPI Phase I_ Epistemology and Research Protocol.md — "Phase Objective" and "Operational Constraints" sections.)
  - Plan (Decision Theory): Transform validated knowledge into deterministic, atomic tasks; produce `plan.md` artifact with verifiable checkboxes. (Source: docs/RPI Phase II_ Operational Doctrine for Strategic Planning.md — "Phase Objective" and "The Plan Artifact (plan.md)").
  - Implement (Operationalization): Mechanically execute plan tasks; follow strict loop and quality gate; produce code and an updated `plan.md` checkbox trail. (Source: docs/RPI Phase III_ The Implementation Operationalization Protocol.md — "Phase Objective" and "Execution Protocol").

- Custom Agents (out of scope for this artifact):
  - The repository documents Custom Agents (e.g., `.agent.md` files and frontmatter), but this research artifact intentionally excludes their use and focuses only on Custom Instructions and Skills. (Source: docs/custom-agents.md — Section 1.2 and 1.3.)

- How Custom Instructions influence agent behavior (explicit docs):
  - Instruction files (workspace/global/agent-wide) are separate from agents and affect generation rules (e.g., `.github/copilot-instructions.md` applies globally). (Source: docs/custom-instructions.md — Section 3.1 "Types of Instruction Files".)
  - `applyTo` patterns allow conditional application of instructions (file-glob scoping). (Source: docs/custom-instructions.md — Section 3.1.B "Frontmatter".)
  - Hierarchy and verification tooling exist (e.g., "Chat Customization Diagnostics" to verify loaded instructions). (Source: docs/custom-instructions.md — Section 3.2 and 3.3 "Best Practices").

- How Skills are discovered, scoped, and executed (per repository docs):
  - Skills are directories containing `SKILL.md` plus resources and are discoverable from configured locations (project: `.github/skills/`, personal: `~/.copilot/skills/`, custom via `chat.agentSkillsLocations`). (Source: docs/agent-skills.md — Sections 2.2 "Locations" and 2.1 "Overview").
  - `SKILL.md` is the canonical definition file for a skill; it must include header metadata (`name`, `description`) and a body with procedures and resource references. (Source: docs/agent-skills.md — Section 2.3 "SKILL.md Format").
  - Differences vs instructions: Skills include executable resources (scripts/templates), are task-specific and loaded on demand; Custom Instructions are always-applied guidelines. (Source: docs/agent-skills.md — Section 2.4 "Comparison: Skills vs. Custom Instructions").

## 3. System Constraints

- Hard constraints imposed by VSCode Copilot & repository guidance (documented):
  - Instruction application: Workspace/global instruction files require settings to be enabled (e.g., `github.copilot.chat.codeGeneration.useInstructionFiles`). (Source: docs/custom-instructions.md — Section 3.1.A.)

  
  (Note: The repository documents Custom Agents, but as requested this artifact excludes their use; see docs/custom-agents.md for the authoritative description if needed.)

- Behavioral constraints imposed by the RPI methodology (explicit):
  - Research phase enforcement: Read-only analysis, no solutioning, and mandatory citations for all factual claims. (Source: docs/RPI Phase I_ Epistemology and Research Protocol.md — "Operational Constraints" and "Citations Required").
  - Plan phase enforcement: Planning cannot begin until `research.md` is validated; Plan outputs must be atomic and checklist-formatted. (Source: docs/RPI Phase II_ Operational Doctrine for Strategic Planning.md — "Operational Constraints" and "The Plan Artifact (plan.md)").
  - Implement phase enforcement: Implementation must follow atomic task loop, Quality Gate (Build/Lint/Test), and recursion protocols for failures. (Source: docs/RPI Phase III_ The Implementation Operationalization Protocol.md — Sections 3 and 5.)

- Implicit contracts between phases (documented):
  - Research → Plan: `research.md` is immutable input for planning; Plan must refuse to start without validated `research.md`. (Source: docs/RPI Phase I_ Epistemology and Research Protocol.md — "The Research Artifact" and docs/RPI Phase II_ Operational Doctrine for Strategic Planning.md — "Input Strictness".)
  - Plan → Implement: `plan.md` drives atomic execution; Implement must not improvise beyond `plan.md`. (Source: docs/RPI Phase II_ Operational Doctrine for Strategic Planning.md — "Atomic Output" and docs/RPI Phase III_ The Implementation Operationalization Protocol.md — "No Improvisation").

## 4. Existing Patterns and Exemplars

- Documented RPI execution patterns (explicit in repository docs):
  - RPI as a recursive, gated pattern with phase artifacts that are the authoritative inputs for the next phase. (Source: docs/The RPI Pattern_ A Research Study.md — Sections 1, 6, and 7.)
  - FAR/FACTS validation gates and handoff triggers are defined per-phase (Research uses FAR; Plan uses FACTS). (Source: docs/RPI Phase I_ Epistemology and Research Protocol.md — "Validation Protocol (The FAR Gate)"; docs/RPI Phase II_ Operational Doctrine for Strategic Planning.md — "Validation Protocol (The FACTS Gate)").

- Existing documented workflow exemplars (only quoting documented material):
  - `SKILL.md` format and directory layout example under `.github/skills/webapp-testing/` showing `SKILL.md`, resource files, and examples. (Source: docs/agent-skills.md — Section 2.2 "Structure Example" and 2.3 "SKILL.md Format").
  - The repository also contains documentation about Custom Agents (see docs/custom-agents.md), but those artifacts are out of scope for this research.

- Repository constraints and conventions (documented):
  - Locations and naming recommendations for Skills (`.github/skills/`), Agents (`.github/agents/`), and instruction files (`.github/copilot-instructions.md`). (Source: docs/agent-skills.md — Section 2.2; docs/custom-agents.md — Section 1.2; docs/custom-instructions.md — Section 3.1.A.)

## 5. Validation — FAR Criteria

- Factual: Yes.
  - Justification: All descriptive claims in this artifact are explicitly referenced to repository documentation (see sources in each section: docs/RPI Phase I_ Epistemology and Research Protocol.md; docs/RPI Phase II_ Operational Doctrine for Strategic Planning.md; docs/RPI Phase III_ The Implementation Operationalization Protocol.md; docs/custom-agents.md; docs/custom-instructions.md; docs/agent-skills.md; docs/The RPI Pattern_ A Research Study.md). (Source: multiple files referenced above.)

- Actionable: Yes (with caveats).
  - Justification: The artifact documents concrete, repository-defined inputs and gates (`research.md`, `plan.md`, `SKILL.md`, `.agent.md` frontmatter fields, `applyTo` patterns). A Planner can, using only these documents and the cited locations, enumerate the tasks needed to implement agent files and skill directories. Caveat: some environment-level toggles and runtime enforcement details (e.g., which VS Code/Copilot versions and settings are required to enforce org-level features) are not fully enumerated and are therefore "unknown" here. (Source: docs/custom-agents.md — fields and locations; docs/custom-instructions.md — settings references.)

- Relevant: Yes.
  - Justification: The content focuses strictly on what exists in repository documentation relevant to implementing an RPI workflow in VSCode (agent definitions, instruction files, skills, phase artifacts, and validation gates). It does not propose solutions or architectures beyond restating documented behavior. (Source: docs/The RPI Pattern_ A Research Study.md — Sections 1 and 7; docs/RPI Phase I/II/III files.)

---

Notes on Unknowns (explicit):
- Precise enforcement mechanics at runtime (which editor versions, product flags, or platform-level controls will cause the host to refuse edits or enforce read-only agent tooling) are not fully specified in repository docs; they are referenced but not enumerated. (Source: docs/custom-agents.md — mentions settings and org-level toggles; docs/custom-instructions.md — mentions settings flags.)

- Canonical repository-level file placement choices are given as recommendations (multiple allowed locations); a single enforced canonical path for agent and skill artifacts is not specified. (Source: docs/custom-agents.md — Section 1.2; docs/agent-skills.md — Section 2.2.)



(End of research artifact.)

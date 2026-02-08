# RPI Scaffold Cloner — Research

Date: 2026-02-08

This document records factual findings (no solutions or plans) to support a future Plan phase for a reusable CLI that replicates the RPI workflow scaffolding from a source project into a target project. All claims are cited.

## 1. Problem statement and underlying intent

- Need: provide a reusable mechanism to copy the complete RPI workflow scaffolding (custom instructions, skills, required project files) from one project into another so teams can bootstrap RPI in new repositories (README.md — "Start a New RPI Project").
  (README.md — "Start a New RPI Project")

- Why now: the repository documents a repeatable RPI artifact layout and verification flow that projects must adopt (README.md — "Artifact Structure" and CI validation notes). Automating replication reduces manual error and ensures consistency (README.md — "Features", "Artifact Structure").
  (README.md — Features; README.md — Artifact Structure)

- Scope of the requested feature (from user constraints): must replicate full RPI workflow scaffolding, avoid overwriting existing files, fail-fast on any existing destination file and produce a conflict report; be usable as a CLI; Node.js is acceptable as part of the stack. (user-supplied feature constraints)

## 2. What "complete RPI workflow scaffolding" means (concrete, verifiable artifacts)

The repository explicitly defines an artifact structure and example files that constitute the RPI scaffold. Items below are derived from repository files and the verification script.

- Required artifact categories and representative paths (explicitly listed in repository files and verification script):
  - Global governance and agent roles: `AGENTS.md` (AGENTS.md)
  - Global Copilot/Instructions: `.github/copilot-instructions.md` (.github/copilot-instructions.md)
  - Scoped instruction files (research/plan phase constraints): `.github/instructions/research.instructions.md`, `.github/instructions/plan.instructions.md` (.github/instructions/*)
  - Skills and skill metadata: `.github/skills/*` including `SKILL.md` and associated resources (scripts/check-vscode-load.sh — SKILL.md checks)
  - Prompts directory: `.github/prompts/*` (scripts/check-vscode-load.sh — prompts checks)
  - Repository phase outputs (NOT part of scaffold to be copied): `.rpi/<project-id>/research.md`, `.rpi/<project-id>/plan.md`, `.rpi/<project-id>/SIGNOFF`. These files are produced by running the RPI workflow and are not considered part of the reusable scaffold that should be cloned into another project (README.md — Artifact Structure; AGENTS.md — Researcher/Planner/Implementer allowed artifacts).
  - Optional workspace helpers: `.vscode/settings.json` (scripts/check-vscode-load.sh — VS Code settings check)
  - CI workflow for validation (expected): `.github/workflows/rpi-validate.yml` (README.md — CI Validation; scripts/check-vscode-load.sh — CI check)

  Sources: (README.md — "Artifact Structure"), (scripts/check-vscode-load.sh — Local Artifact Verification section), (AGENTS.md — Agent Roles and Responsibilities).

- In concrete terms, "complete scaffold" means the set of files and directories that the repository's verification script checks for and the artifact structure documented in README.md and AGENTS.md. The verification script explicitly lists many of these files and directories and treats them as required for a functioning RPI workspace (scripts/check-vscode-load.sh — "Checking required artifacts in repository...").
  (scripts/check-vscode-load.sh — "Checking required artifacts in repository...")

## 3. Conceptual scope

In-scope (must be considered by the cloner):

- All RPI governance and instruction artifacts that are part of a project's scaffold and are checked by the repository's verification tooling:
  - `AGENTS.md` (governance) (AGENTS.md)
  - `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md` (phase constraints) (.github/copilot-instructions.md; .github/instructions/research.instructions.md)
  - `.github/skills/*` including `SKILL.md` and associated resources (scripts/check-vscode-load.sh — SKILL.md checks)
  - `.github/prompts/*` (scripts/check-vscode-load.sh — prompts checks)
  - `.github/workflows/rpi-validate.yml` (CI validation, if present) (README.md — CI Validation)
  - Note: `.rpi/<project-id>/` phase outputs (for example, `research.md`, `plan.md`, `SIGNOFF`) are produced by running the RPI workflow and are not considered part of the reusable scaffold to be cloned. The cloner should copy the governance and `.github` artifacts that enable these outputs, not the `.rpi/` outputs themselves (README.md — Artifact Structure).
  - `.vscode/settings.json` and other optional workspace configs referenced by verification tooling (scripts/check-vscode-load.sh — VS Code settings check)

Sources: (README.md — Artifact Structure), (scripts/check-vscode-load.sh — Local Artifact Verification checks), (AGENTS.md — permitted artifact edits by role).

Out-of-scope (explicitly excluded unless required):

- Anything that would alter the meaning or semantics of the RPI workflow itself (policy/governance content), because repository governance files state roles and handoff rules that must not be changed by scaffolding operations (AGENTS.md — Handoff Rules; copilot-instructions.md — Core Principles).
  (AGENTS.md — Handoff Rules; .github/copilot-instructions.md — Core Principles)

- Project-specific secrets, credentials, or environment-specific configuration (e.g., credentials, provisioning scripts, local environment overrides). These are not included in the repo's verification list and are explicitly environment-specific by nature (not listed in scripts/check-vscode-load.sh).

- Any transformation that changes the repository's RPI workflow validation behavior; the user requirement explicitly forbids altering the existing RPI workflow (user-supplied constraints; AGENTS.md governance implies separation of phases).

## 4. System constraints and behavioral requirements (detailed)

- Fail-fast "no overwrite" rule (as required by feature constraints):
  - Behavior: The replication process must stop entirely if any destination path that the cloner intends to create already exists in the target repository. The process must not perform any writes in the target if any conflicting path exists. (user-supplied core constraint; consistent with a fail-fast safety posture in governance files such as AGENTS.md which require controlled handoffs and signoffs).
  - Rationale/observations: the repository enforces explicit artifact presence and cautious phase transitions (README.md — Phase transitions); a cloner that silently overwrote files would violate that practice.

- Definition of "file exists" (observable definitions and platform nuances):
  - File types to detect as conflicts: regular files and directories that would be created by the cloner. A conflicting path is any filesystem entry (file, directory, or symlink) that occupies the same path the cloner would create. (Node.js fs semantics — fs.lstat / fs.stat; see below).
    (Node.js fs docs — https://nodejs.org/api/fs.html#fsstatpath-options-callback)
  - Symlink behavior: detection must differentiate symlinks from their targets. On POSIX-like systems, `lstat` reports the symlink itself while `stat` resolves the target; a cloner should treat an existing symlink at a target path as a present conflicting entry (Node.js fs.lstat docs). (Node.js fs.lstat — https://nodejs.org/api/fs.html#fslstatpath-options-callback)
  - Case sensitivity: file existence checks behave differently per filesystem (macOS by default uses case-insensitive APFS/HFS+ mounts; Linux filesystems are case-sensitive; Windows NTFS is case-insensitive by default but can be case-sensitive). The cloner must account for case sensitivity differences when comparing source paths to target paths. (Apple APFS docs; Microsoft NTFS docs; Node.js path normalization notes). For platform-agnostic behavior, the cloner should perform path normalization and canonicalization and treat path comparisons in a way that respects the target filesystem semantics. (Node.js path docs — https://nodejs.org/api/path.html)
    (Apple Developer — APFS; Microsoft Docs — NTFS case sensitivity)
  - Permissions: an existing path may be present but unreadable/writable. The cloner must treat the presence of a path as a conflict even if the cloner lacks write permission; the operation must fail-fast and report the conflict (POSIX permissions model; Windows ACL behavior).

- Reporting requirements (minimum):
  - The conflict report must be generated when the process fails due to existing paths. At minimum the report must list, for each conflict:
    1. Conflicting file path (relative to project root)
    2. What the cloner expected to create (source path or artifact type)
    3. What was found in the target (file/directory/symlink + basic metadata: size, type)
    4. Next-step guidance text: "resolve manually in target project, then retry" (user-specified guidance)
  - The report format: repository patterns show plain-text reporting (scripts/check-vscode-load.sh echoes human-readable checks); therefore a plain-text or machine-readable (JSON) report are both actionable. The research phase records that the verification script uses human-readable console output; a machine-readable JSON report would be actionable for automation, but the repository does not currently mandate a format. (scripts/check-vscode-load.sh — reporting style)

- Cross-platform considerations (explicit):
  - Path separators and drive letters: Windows uses backslashes and drive letters; POSIX systems use forward slashes. Use platform-aware path normalization when enumerating or comparing paths (Node.js path.sep and path.normalize) (Node.js path docs — https://nodejs.org/api/path.html).
  - Case sensitivity differences must be respected as above; a case-insensitive target must be detected as such to avoid false-negative conflict checks (Apple APFS behavior; Microsoft NTFS behavior).
  - Symlink semantics differ across platforms (Windows has symlink reparse points vs POSIX symlinks); detection via lstat is required to identify symlink entries reliably (Node.js fs.lstat docs).
  - Line endings or text encoding are not primary conflict criteria for existence checks but may matter if the cloner eventually performs content comparison; repository currently uses Unix-style shell and Markdown files (scripts/check-vscode-load.sh, README.md) and provides no normalization rules.

  Sources: (Node.js fs docs — https://nodejs.org/api/fs.html), (Node.js path docs — https://nodejs.org/api/path.html), (scripts/check-vscode-load.sh — OS-specific log paths and checks), (README.md — CI and verification), (AGENTS.md — governance constraints).

## 5. Existing patterns and exemplars in this codebase

- Verification script: `scripts/check-vscode-load.sh` demonstrates how this repository defines and verifies required artifacts; it specifically enumerates files and directories the workspace expects and prints user-facing messages for missing/present items. This script is a direct exemplar of what the cloner must populate. (scripts/check-vscode-load.sh — entire script; see "Checking required artifacts in repository...").

- Artifact layout: `README.md` documents two related things: the reusable scaffold (governance files, `.github` instructions, skills, prompts, and workflows) and the per-project phase outputs under `.rpi/<project-id>/` (research/plan/SIGNOFF). The `.rpi/` entries are phase outputs produced by using the RPI workflow and are not part of the reusable scaffold to be cloned. The reusable scaffold items to copy are the governance, `.github` instructions, skills, prompts, and workflows described in the README. (README.md — "Artifact Structure", "Phase 1/2/3 sections").

- Instruction files: `.github/instructions/research.instructions.md` and `.github/instructions/plan.instructions.md` declare formal constraints and frontmatter requirements. These files show that instruction artifacts include structured YAML frontmatter and explicit `applyTo` metadata that must be preserved when copying. ( .github/instructions/research.instructions.md — frontmatter; .github/instructions/plan.instructions.md — task format )

- Skill pattern: `.github/skills/rpi-workflow/SKILL.md` is referenced by the verification script as a required skill artifact and is expected to contain frontmatter fields like `name` and `description`. (scripts/check-vscode-load.sh — SKILL.md frontmatter checks)

- Automation/CLI examples: repository contains only a shell verification helper (`scripts/check-vscode-load.sh`) and no existing Node.js-based cloner or generator; there is no `package.json` or Node.js scaffolding present in the repository root that indicates an existing Node-based CLI pattern. (repo root listing; presence of `scripts/check-vscode-load.sh` and lack of `package.json`)

  Sources: (scripts/check-vscode-load.sh), (README.md — templates and expected outputs), (.github/instructions/*), (AGENTS.md).

## 6. Unknowns that require investigation in the Plan phase

- Copy scope ambiguity: whether the cloner should copy only the canonical set of artifacts (those explicitly listed in README.md and the verification script) or also include additional files commonly used in some projects (e.g., supplemental docs in `.rpi-docs/`, extra skill resources). The repository lists many artifacts but not an exhaustive machine-readable manifest for a scaffold. (README.md — Artifact Structure; scripts/check-vscode-load.sh — checked files)

- Versioning and profiles: whether the cloner must support multiple scaffold variants (profiles) or versions (e.g., minimal vs full scaffold) — the repository does not document multiple profiles. (no manifest for profiles present in README.md)

- Merge vs copy policy for non-conflicting files: the user requires no overwrites and fail-fast on any conflict, but it remains unknown whether the cloner should support a "dry-run" mode, or an "override with explicit consent" mode; the user required fail-fast as core constraint, which suggests such options are out-of-scope unless explicitly requested.

- Integration behavior after copy: whether the destination project needs additional registration steps (e.g., adding workflows to CI, updating package manifests, or updating repository-level settings). The repository's verification script only checks presence, not registration. (scripts/check-vscode-load.sh — checks presence only)

- Handling of large binary files, file permissions, and executable bits: the repository uses text artifacts and scripts; behavior for binaries or preserving executable mode is not documented. (script and markdown files present; no explicit binary-handling guidance)

These unknowns should be explicitly resolved in the Plan phase with acceptance criteria and decisions grounded in the facts above.

## 7. Minimum actionable observations to inform planning

- The canonical scaffold items to copy are the files and directories enumerated by `scripts/check-vscode-load.sh` and described in `README.md` (README.md — Artifact Structure; scripts/check-vscode-load.sh — required artifacts list).

- The cloner must implement a pre-copy existence check that treats any existing path as a fatal conflict and aborts before making changes; the conflict report must include path, intended artifact, discovered type/metadata, and the explicit retry guidance "resolve manually in target project, then retry" (user-supplied constraint; scripts/check-vscode-load.sh exemplifies human-readable reporting).

- Node.js provides the necessary primitives to implement file/directory/symlink detection, lstat/stat differentiation, and cross-platform path normalization (Node.js fs and path APIs). Relevant documentation: Node.js `fs` module and `path` module. (https://nodejs.org/api/fs.html; https://nodejs.org/api/path.html)

## 8. Notes on sources

- Local repository files (primary sources):
  - AGENTS.md (repository root) — governance and role rules (AGENTS.md)
  - README.md (repository root) — artifact structure, phase descriptions (README.md)
  - scripts/check-vscode-load.sh (scripts/) — enumerates required artifacts and OS/FS considerations (scripts/check-vscode-load.sh)
  - .github/instructions/research.instructions.md and plan.instructions.md — research/plan phase constraints ( .github/instructions/research.instructions.md )
  - .github/copilot-instructions.md — RPI Constitution and core principles (.github/copilot-instructions.md)

- External documentation (platform/stack references):
  - Node.js `fs` module — file/stat/lstat behavior: https://nodejs.org/api/fs.html
  - Node.js `path` module — path normalization and separators: https://nodejs.org/api/path.html
  - Platform notes on case sensitivity: Apple APFS docs; Microsoft NTFS documentation on case sensitivity (see vendor docs for details).

## 9. FAR validation

- **Factual:** All claims reference repository files or authoritative external docs: `README.md`, `AGENTS.md`, `scripts/check-vscode-load.sh`, `.github/instructions/*`, and Node.js docs are cited above and used as the basis for filesystem/OS behavior assertions.

- **Actionable:** Research produces concrete inputs for planning: exact file paths to consider, requirement for pre-copy existence checks, required report fields, and Node.js API pointers for implementing detection and cross-platform path normalization.

- **Relevant:** Research includes only items that affect implementing a safe, non-destructive scaffold cloner: files to copy, fail-fast semantics, conflict reporting, platform caveats, and explicit unknowns to resolve in Plan.

---

References:

- AGENTS.md (repository root)
- README.md (repository root)
- scripts/check-vscode-load.sh (scripts/)
- .github/instructions/research.instructions.md
- .github/instructions/plan.instructions.md
- .github/copilot-instructions.md
- Node.js `fs` docs: https://nodejs.org/api/fs.html
- Node.js `path` docs: https://nodejs.org/api/path.html

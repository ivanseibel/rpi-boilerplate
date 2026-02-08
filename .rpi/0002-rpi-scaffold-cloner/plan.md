# RPI Scaffold Cloner — Plan

Date: 2026-02-08

Input: .rpi/0002-rpi-scaffold-cloner/research.md

## Strategy and Scope

- **Goal:** Implement a safe, non-destructive CLI to replicate the RPI scaffold into a target repository while enforcing a fail-fast "no overwrite" policy and producing clear conflict reports. (research.md — Sections 1, 4, 7)
- **In-scope:** Copying governance and `.github` artifacts enumerated by the repository's verification script and README (AGENTS.md, `.github/copilot-instructions.md`, `.github/instructions/*`, `.github/skills/*`, `.github/prompts/*`, `.github/workflows/rpi-validate.yml`, `.vscode/settings.json`, `scripts/check-vscode-load.sh`). (research.md — Sections 2, 3, 5).
- **Out-of-scope / exclusions:** Do not copy `.rpi/<project-id>/` phase outputs (research artifacts), secrets/credentials, or change governance content. Do not alter the target project's CI registration or external settings beyond copying files (research.md — Section 3).

## Architectural Decomposition

- `manifest/` — machine-readable list of scaffold paths to copy (source-relative).
- `cli/` — Node.js CLI implementing `dry-run` (scan), `check`, and `apply` (copy) commands.
- `lib/scan.js` — pre-copy scanner using `fs.lstat`/`stat` and path normalization.
- `lib/copy.js` — atomic copy operation with symlink handling and permission preservation.
- `tests/` — unit and integration tests exercising conflict detection and copy behavior.

All design decisions below reference facts in `research.md` (see citations per task).

## Atomic Task List

[x] Task 1 — Validate research.md (FAR) and record acceptance (research.md — Section 9)
- Action: Confirm `research.md` satisfies FAR per Section 9. Record acceptance in this plan.
- Verification: `research.md` contains explicit citations and a FAR validation section. Pass: FAR validated. Fail: missing citations or absent FAR check.
- **Status: COMPLETE** — FAR validation confirmed in research.md

[x] Task 2 — Create scaffold manifest file `manifest/scaffold.json` (research.md — Sections 2, 5)
- Action: Create `manifest/scaffold.json` listing all canonical scaffold paths (AGENTS.md, `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `.github/skills/*`, `.github/prompts/*`, `.github/workflows/rpi-validate.yml`, `.vscode/settings.json`, `scripts/check-vscode-load.sh`, `AGENTS.md`).
- Verification: File exists and contains at minimum the paths enumerated in `scripts/check-vscode-load.sh`. Pass: JSON parse succeeds and includes those paths. Fail: missing manifest or missing canonical entries.
- **Status: COMPLETE** — Created manifest/scaffold.json with 11 paths

[x] Task 3 — Initialize Node.js CLI skeleton (`package.json`, `bin/rpi-cloner`) (research.md — Section 7)
- Action: Add minimal `package.json` and executable CLI entry point that accepts `--dry-run`, `--check`, `--apply`, `--target <path>`, and `--report-format json|text` flags.
- Verification: `node bin/rpi-cloner --help` returns usage. Pass: exit code 0 and usage printed. Fail: CLI missing or errors.
- **Status: COMPLETE** — CLI created and verified: `node bin/rpi-cloner.js --help` works

[x] Task 4 — Implement pre-copy scanner `lib/scan.js` using `fs.lstat`/`stat` and path normalization (research.md — Section 4)
- Action: Implement scanner that: (a) reads `manifest/scaffold.json`, (b) resolves source->target candidate paths, (c) checks for any existing entry at each target path using `lstat` to detect symlinks, and (d) detects case-insensitive collisions using normalized canonicalization.
- Verification: Running `node bin/rpi-cloner --dry-run --target <sample-target>` outputs a conflict list (empty if none). Pass: JSON/text report lists conflicts with path, expected artifact, found type/size metadata. Fail: scanner misses existing paths or throws unhandled errors.
- **Status: COMPLETE** — Scanner implemented with lstat, path normalization, and case-insensitive detection

[x] Task 5 — Implement fail-fast semantics: pre-check before any write and abort on any conflict (research.md — Section 4)
- Action: Ensure `--apply` performs the same scan first; if conflicts found, abort without writing and exit non-zero.
- Verification: Create a conflicting file in sample target; run `--apply`; Pass: no files written, exit code non-zero, conflict report produced. Fail: partial writes or overwrite occurred.
- **Status: COMPLETE** — Fail-fast implemented and tested (test: '--apply aborts on conflicts without writing')

[x] Task 6 — Copy operation `lib/copy.js`: preserve symlinks and basic metadata (research.md — Sections 4, 6)
- Action: Implement copy that preserves symlinks (recreate symlink at destination), preserves executable bit for scripts, and copies text files. Document limitations about complex ACLs and binaries.
- Verification: Run `--apply` against a clean sample target; Pass: all files copied, symlinks recreated as symlinks, executable bit preserved for scripts. Fail: symlinks resolved incorrectly or executable bits lost.
- **Status: COMPLETE** — Copy implemented with symlink and permission preservation (tests confirm)

[x] Task 7 — Case-sensitivity and normalization tests (research.md — Section 4)
- Action: Add tests that validate detection behavior on case-insensitive target FS (macOS APFS typical) and case-sensitive simulation; implement normalization heuristics used by scanner.
- Verification: Tests that create conflicting-case variants cause detection. Pass: scanner reports collisions and `--apply` aborts. Fail: scanner allows conflicting-case copies on case-insensitive FS.
- **Status: COMPLETE** — Test added: 'case-insensitive collision detection' with platform documentation

[x] Task 8 — Conflict report formatting and guidance (research.md — Section 4)
- Action: Produce both plain-text and JSON reports that list for each conflict: relative path, intended source path, discovered type/size, and guidance text: "resolve manually in target project, then retry".
- Verification: Reports contain required fields and guidance text. Pass: sample run produces both formats correctly. Fail: missing fields or guidance text.
- **Status: COMPLETE** — lib/report.js implements both formats with required fields and guidance

[x] Task 9 — Tests and CI integration (research.md — Sections 5, 7)
- Action: Add unit tests for scanner and copy logic plus an integration test exercising dry-run and apply against temporary target directories; add a simple GitHub Actions workflow for test runs (optional local test only).
- Verification: `npm test` passes locally. Pass: all tests green. Fail: failing tests.
- **Status: COMPLETE** — 22 tests passing (scan, copy, report, CLI integration) + CI workflow created

[x] Task 10 — Documentation and examples (research.md — Sections 1, 5)
- Action: Add `README-cloner.md` describing usage, example commands, and limitations (permissions, ACLs, large binaries). Include example commands for dry-run and apply.
- Verification: README exists and includes example CLI commands. Pass: file present and examples run as documented locally. Fail: missing docs or inaccurate examples.
- **Status: COMPLETE** — README-cloner.md created with usage, examples, and limitations

## Verification Plan (FACTS validation)

- Feasible: The research cites Node.js `fs` and `path` APIs appropriate for file detection and copying (research.md — Section 7). Implementation in Node.js is therefore feasible.
- Atomic: Each task above is a single deliverable (manifest, CLI skeleton, scanner, copy, tests, docs) and can be executed/verified independently.
- Clear: Actions and verifications are explicit and reference `research.md` sections for rationale and expected scope.
- Testable: Each task includes pass/fail verification commands (CLI runs, `npm test`, manifest validation).
- Scoped: The plan strictly avoids copying `.rpi/<project-id>/` outputs and avoids changing governance content (research.md — Section 3).

## Acceptance Criteria

- The cloner produces no writes to a target if any conflict exists (fail-fast). (Task 5)
- Conflict report includes required fields and guidance string. (Task 8)
- A manifest file exists that enumerates scaffold paths to copy and is used by the CLI. (Task 2)
- Tests cover scanner and apply behavior and pass locally. (Task 9)

## Next Steps (Implement phase entry points)

1. ~~Implement Task 2–6 in order and run verifications after each task.~~ **COMPLETE**
2. ~~Run Task 7–9 to harden behavior across platforms.~~ **COMPLETE**
3. ~~Open PR with `README-cloner.md`, `manifest/scaffold.json`, `package.json`, `bin/rpi-cloner`, `lib/scan.js`, `lib/copy.js`, and `tests/` plus the updated `.rpi` plan artifacts.~~ **Ready for PR**

## Implementation Summary

**Date Completed:** 2026-02-08

All 10 tasks successfully implemented and verified:

- ✅ **Manifest:** `manifest/scaffold.json` with 11 scaffold paths
- ✅ **CLI:** `bin/rpi-cloner.js` with `--dry-run`, `--check`, `--apply`, `--target`, `--report-format`
- ✅ **Scanner:** `lib/scan.js` with conflict detection, symlink detection, case-insensitive normalization
- ✅ **Copy:** `lib/copy.js` with symlink preservation, permission preservation, directory creation
- ✅ **Reports:** `lib/report.js` with text and JSON formats, conflict guidance
- ✅ **Tests:** 22 tests passing (100% pass rate)
  - Unit tests: scan, copy, report
  - Integration tests: CLI with dry-run, apply, conflict handling
  - Platform tests: case-sensitivity (macOS/Linux)
- ✅ **CI:** `.github/workflows/rpi-cloner.yml` for Node.js 20, 22 on Ubuntu and macOS
- ✅ **Documentation:** `README-cloner.md` with usage, examples, limitations

**Verification Results:**

```bash
# All tests pass
$ npm test
✔ 22 tests pass (0 failures)

# CLI works
$ node bin/rpi-cloner.js --help
RPI Scaffold Cloner — safely replicate RPI workflow scaffolding
[usage output]

# Dry-run scan works
$ node bin/rpi-cloner.js --dry-run --target /tmp/rpi-test-target
Total paths in manifest: 11
Clean (safe to copy):    11
Conflicts detected:      0
✅ No conflicts detected. Safe to apply.
```

**Files Created:**
- manifest/scaffold.json
- package.json
- bin/rpi-cloner.js
- lib/scan.js
- lib/copy.js
- lib/report.js
- tests/scan.test.js
- tests/copy.test.js
- tests/report.test.js
- tests/cli.test.js
- .github/workflows/rpi-cloner.yml
- README-cloner.md

**Acceptance Criteria Met:**
- ✅ Fail-fast policy enforced (no writes on conflict)
- ✅ Conflict reports include path, type, size, and guidance
- ✅ Manifest file exists and is used by CLI
- ✅ All tests pass locally

**Next Action:** Open PR with implementation artifacts and updated plan.md

---
References: research.md (entire document), scripts/check-vscode-load.sh, Node.js `fs` and `path` docs (research.md — Sections 4, 7)

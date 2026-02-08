# RPI Scaffold Cloner

A safe, non-destructive CLI tool to replicate the complete RPI (Research → Plan → Implement) workflow scaffolding from this repository into a target project.

## Overview

The RPI Scaffold Cloner copies governance files, custom instructions, skills, prompts, and CI configuration from this RPI boilerplate repository into your target project. It enforces a strict **fail-fast "no overwrite" policy**: if any destination file already exists, the tool aborts without writing anything and produces a conflict report.

## Features

- ✅ **Safe by default**: Never overwrites existing files
- ✅ **Fail-fast**: Aborts on any conflict before writing
- ✅ **Symlink preservation**: Recreates symlinks as symlinks
- ✅ **Permission preservation**: Maintains executable bits for scripts
- ✅ **Detailed conflict reports**: JSON or text format
- ✅ **Dry-run mode**: Preview changes before applying

## Installation

No installation required — run directly from this repository using Node.js 20+:

```bash
node bin/rpi-cloner.js [OPTIONS]
```

Or make it executable:

```bash
chmod +x bin/rpi-cloner.js
./bin/rpi-cloner.js [OPTIONS]
```

## Usage

### Basic Commands

**Dry-run (scan for conflicts without writing):**
```bash
node bin/rpi-cloner.js --dry-run --target /path/to/your/project
```

**Check (alias for dry-run):**
```bash
node bin/rpi-cloner.js --check --target /path/to/your/project
```

**Apply scaffold (fail-fast on any conflict):**
```bash
node bin/rpi-cloner.js --apply --target /path/to/your/project
```

**Get JSON conflict report:**
```bash
node bin/rpi-cloner.js --check --target /path/to/your/project --report-format json
```

### Options

| Option                  | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `--dry-run`             | Scan target for conflicts without writing (default mode) |
| `--check`               | Alias for `--dry-run`                                    |
| `--apply`               | Copy scaffold files to target (aborts on any conflict)   |
| `--target <path>`       | Target repository path (required)                        |
| `--report-format <fmt>` | Output format: `json` \| `text` (default: `text`)        |
| `--help`                | Show help message                                        |

## What Gets Copied

The cloner copies the following RPI workflow artifacts (defined in [`manifest/scaffold.json`](manifest/scaffold.json)):

### Governance & Instructions
- `AGENTS.md` — Agent roles and responsibilities
- `.github/copilot-instructions.md` — Global Copilot instructions
- `.github/instructions/research.instructions.md` — Research phase constraints
- `.github/instructions/plan.instructions.md` — Plan phase constraints

### Skills & Prompts
- `.github/skills/rpi-workflow/SKILL.md` — RPI workflow skill
- `.github/prompts/research.prompt.md` — Research phase prompt
- `.github/prompts/plan.prompt.md` — Plan phase prompt
- `.github/prompts/implement.prompt.md` — Implement phase prompt

### CI & Tools
- `.github/workflows/rpi-validate.yml` — RPI validation workflow
- `scripts/check-vscode-load.sh` — VS Code artifact verification script

### Workspace Config
- `.vscode/settings.json` — VS Code workspace settings

**Note:** The cloner does **not** copy `.rpi/<project-id>/` phase outputs (`research.md`, `plan.md`, `SIGNOFF`). These files are produced by running the RPI workflow in your project, not part of the reusable scaffold.

## Workflow

### 1. Scan for Conflicts (Dry-run)

```bash
node bin/rpi-cloner.js --dry-run --target /path/to/your/project
```

**Sample output (no conflicts):**
```
RPI Scaffold Cloner — Scan Report
============================================================

Total paths in manifest: 11
Clean (safe to copy):    11
Conflicts detected:      0

✅ No conflicts detected.

Clean paths:
  AGENTS.md
  .github/copilot-instructions.md
  ...
```

### 2. Review Conflicts (if any)

**Sample output (with conflicts):**
```
RPI Scaffold Cloner — Scan Report
============================================================

Total paths in manifest: 11
Clean (safe to copy):    10
Conflicts detected:      1

CONFLICTS
------------------------------------------------------------

Path: AGENTS.md
  Target: /path/to/your/project/AGENTS.md
  Discovered: file (523 bytes)
  Expected:   file (1024 bytes)

  ⚠️  Resolution: Resolve manually in target project, then retry.
```

**Resolution:** Manually rename, move, or delete the conflicting file in your target project, then re-run the cloner.

### 3. Apply Changes

Once the target is clean (no conflicts):

```bash
node bin/rpi-cloner.js --apply --target /path/to/your/project
```

**Sample output:**
```
✅ Successfully copied 11 files to /path/to/your/project
```

## Conflict Handling

The cloner uses a **fail-fast approach**:

1. **Pre-scan:** Always scans target before writing (even in `--apply` mode)
2. **Detect conflicts:** Checks for existing files, symlinks, or directories at target paths
3. **Abort on conflict:** If any conflict found, exits with non-zero code and produces a report
4. **No partial writes:** Never writes some files and skips others — it's all or nothing

### Case-Sensitivity

The scanner normalizes paths to lowercase for comparison, providing basic case-insensitive conflict detection on macOS APFS and similar filesystems. On case-sensitive Linux filesystems, `File.txt` and `file.txt` are treated as different paths by the OS but normalized by the scanner.

## Limitations

### Permissions & ACLs
- **Supported:** Basic Unix permission bits (read, write, execute)
- **Not supported:** Complex ACLs, extended attributes, SELinux contexts
- **Recommendation:** Review and adjust permissions manually after copying if needed

### Symlinks
- **Supported:** Recreates symlinks as symlinks (does not resolve/follow them)
- **Limitation:** Relative symlinks are preserved as-is; ensure they remain valid in target context

### Large Files & Binaries
- The cloner copies text files and small binaries efficiently
- Very large files (> 100 MB) may cause memory issues
- **Current scaffold:** All RPI artifacts are small text files (< 1 MB total)

### Platform Compatibility
- **Tested:** macOS (APFS), Linux (ext4, tmpfs)
- **Windows:** Should work but symlink creation requires admin privileges or Developer Mode
- **CI tested:** Ubuntu and macOS (see `.github/workflows/rpi-cloner.yml`)

## Testing

Run unit and integration tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Test Coverage

- **Unit tests:** `tests/scan.test.js`, `tests/copy.test.js`, `tests/report.test.js`
- **Integration tests:** `tests/cli.test.js`
- **Scenarios covered:**
  - Clean target (no conflicts)
  - File conflicts
  - Directory conflicts
  - Symlink handling
  - Case-insensitive collisions (macOS)
  - Executable bit preservation
  - Fail-fast abort semantics

## Troubleshooting

### "Error: EACCES: permission denied"

The target directory requires write permissions. Run with appropriate privileges or adjust target directory permissions:

```bash
chmod u+w /path/to/your/project
```

### "Error: EEXIST: file already exists"

A file exists at the target path. This should be caught by the pre-scan, but if you see this error:

1. Run `--dry-run` to get a full conflict report
2. Manually resolve conflicts
3. Retry `--apply`

### Symlink Creation Fails (Windows)

On Windows, symlink creation requires:
- **Option 1:** Run terminal as Administrator
- **Option 2:** Enable Developer Mode (Settings → Update & Security → For developers)

### Tests Fail on Case-Sensitive Test

The case-sensitivity test (`tests/scan.test.js`) documents platform-specific behavior. On Linux (case-sensitive FS), the test results may differ from macOS (case-insensitive FS). This is expected and documented in the test.

## CI Integration

The cloner includes a GitHub Actions workflow (`.github/workflows/rpi-cloner.yml`) that:

- Runs tests on Node.js 20 and 22
- Validates on Ubuntu and macOS
- Verifies manifest integrity (all paths exist in source)
- Performs smoke test (dry-run against temp target)

## Examples

### Example 1: New Project Bootstrap

```bash
# Create new project directory
mkdir my-new-project
cd my-new-project
git init

# Clone RPI scaffold
node /path/to/rpi-boilerplate/bin/rpi-cloner.js --apply --target .

# Verify
ls -la .github/
```

### Example 2: Conflict Resolution

```bash
# Scan for conflicts
node bin/rpi-cloner.js --check --target /path/to/existing/project --report-format json > conflicts.json

# Review conflicts
cat conflicts.json | jq '.conflicts[] | .path'

# Manually resolve (example: rename conflicting file)
cd /path/to/existing/project
mv AGENTS.md AGENTS.md.backup

# Retry apply
node /path/to/rpi-boilerplate/bin/rpi-cloner.js --apply --target /path/to/existing/project
```

### Example 3: Continuous Sync (Advanced)

To keep target project up-to-date with boilerplate changes:

```bash
# In your project root, add a script to check for updates
cat > scripts/sync-rpi-scaffold.sh << 'EOF'
#!/bin/bash
BOILERPLATE=/path/to/rpi-boilerplate
node "$BOILERPLATE/bin/rpi-cloner.js" --check --target . || {
  echo "Conflicts detected. Review and resolve manually."
  exit 1
}
EOF

chmod +x scripts/sync-rpi-scaffold.sh

# Run periodically or in CI
./scripts/sync-rpi-scaffold.sh
```

## Contributing

When updating the RPI scaffold:

1. Update `manifest/scaffold.json` if adding/removing files
2. Update this README with new paths or usage patterns
3. Add tests for new functionality
4. Verify CI passes on all platforms

## License

MIT

---

**References:**
- [AGENTS.md](AGENTS.md) — RPI agent roles and governance
- [manifest/scaffold.json](manifest/scaffold.json) — Canonical list of scaffold paths
- [.github/workflows/rpi-cloner.yml](.github/workflows/rpi-cloner.yml) — CI validation

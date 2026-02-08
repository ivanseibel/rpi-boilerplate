#!/bin/bash

# VS Code Load Check Helper Script
# This script provides guidance for verifying that VS Code has loaded RPI workflow artifacts

set -e

echo "==================================================================="
echo "VS Code RPI Workflow Load Check"
echo "==================================================================="
echo ""

echo "This script helps you verify that VS Code has loaded custom instructions and skills."
echo "Follow these manual verification steps:"
echo ""

echo "-------------------------------------------------------------------"
echo "Step 1: Open Customization Diagnostics"
echo "-------------------------------------------------------------------"
echo "  1. Open Command Palette (Cmd+Shift+P or Ctrl+Shift+P)"
echo "  2. Search for: 'Copilot Chat: Show Customization Diagnostics'"
echo "  3. Run the command"
echo ""

echo "-------------------------------------------------------------------"
echo "Step 2: Check Loaded Artifacts"
echo "-------------------------------------------------------------------"
echo "  In the diagnostics output, verify:"
echo ""
echo "  Custom Instructions:"
echo "    ✓ .github/copilot-instructions.md (global)"
echo "    ✓ .github/instructions/research.instructions.md"
echo "    ✓ .github/instructions/plan.instructions.md"
echo ""
echo "  Skills:"
echo "    ✓ rpi-workflow"
echo ""

echo "-------------------------------------------------------------------"
echo "Step 3: Check Developer Tools (If Issues Found)"
echo "-------------------------------------------------------------------"
echo "  1. Open: Help → Toggle Developer Tools"
echo "  2. Go to Console tab"
echo "  3. Search for 'instruction' or 'skill' to find loading errors"
echo ""

echo "-------------------------------------------------------------------"
echo "Log File Locations"
echo "-------------------------------------------------------------------"

if [[ "$OSTYPE" == "darwin"* ]]; then
  LOG_PATH="$HOME/Library/Application Support/Code/logs/"
  echo "  macOS: $LOG_PATH"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  LOG_PATH="$HOME/.config/Code/logs/"
  echo "  Linux: $LOG_PATH"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  LOG_PATH="$APPDATA/Code/logs/"
  echo "  Windows: %APPDATA%\\Code\\logs\\"
else
  echo "  Unknown OS. Check VS Code documentation for log locations."
fi

echo ""
echo "-------------------------------------------------------------------"
echo "Local Artifact Verification"
echo "-------------------------------------------------------------------"

# Check for required files
echo ""
echo "Checking required artifacts in repository..."
echo ""

check_file() {
  if [ -f "$1" ]; then
    echo "  ✅ $1"
  else
    echo "  ❌ $1 (MISSING)"
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo "  ✅ $1/"
  else
    echo "  ❌ $1/ (MISSING)"
  fi
}

# Global instructions
check_file ".github/copilot-instructions.md"

# Scoped instructions
check_dir ".github/instructions"
check_file ".github/instructions/research.instructions.md"
check_file ".github/instructions/plan.instructions.md"

# Skills
check_dir ".github/skills/rpi-workflow"
check_file ".github/skills/rpi-workflow/SKILL.md"

# Governance
check_file "AGENTS.md"
check_file ".rpi/AGENTS.md"

# Prompts
check_dir ".github/prompts"
check_file ".github/prompts/research.prompt.md"
check_file ".github/prompts/plan.prompt.md"
check_file ".github/prompts/implement.prompt.md"

# VS Code settings
check_file ".vscode/settings.json"

# CI
check_file ".github/workflows/rpi-validate.yml"

echo ""
echo "-------------------------------------------------------------------"
echo "Frontmatter Validation"
echo "-------------------------------------------------------------------"
echo ""

# Check YAML frontmatter in scoped instructions
if grep -q "^---" ".github/instructions/research.instructions.md" 2>/dev/null; then
  echo "  ✅ research.instructions.md has frontmatter delimiter"
else
  echo "  ❌ research.instructions.md missing frontmatter delimiter (---)"
fi

if grep -q "applyTo:" ".github/instructions/research.instructions.md" 2>/dev/null; then
  echo "  ✅ research.instructions.md has applyTo field"
else
  echo "  ❌ research.instructions.md missing applyTo field"
fi

# Check SKILL.md frontmatter
if grep -q "^---" ".github/skills/rpi-workflow/SKILL.md" 2>/dev/null; then
  echo "  ✅ SKILL.md has frontmatter delimiter"
else
  echo "  ❌ SKILL.md missing frontmatter delimiter (---)"
fi

if grep -q "^name: " ".github/skills/rpi-workflow/SKILL.md" 2>/dev/null; then
  echo "  ✅ SKILL.md has name field"
else
  echo "  ❌ SKILL.md missing name field"
fi

if grep -q "^description: " ".github/skills/rpi-workflow/SKILL.md" 2>/dev/null; then
  echo "  ✅ SKILL.md has description field"
else
  echo "  ❌ SKILL.md missing description field"
fi

echo ""
echo "==================================================================="
echo "If any checks failed above, review docs/rpi-workflow.md for guidance."
echo "For loading issues, open a GitHub issue with VS Code logs attached."
echo "==================================================================="
echo ""

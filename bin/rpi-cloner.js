#!/usr/bin/env node

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { copy } from "../lib/copy.js";
import { formatReport } from "../lib/report.js";
import { scan } from "../lib/scan.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const USAGE = `
RPI Scaffold Cloner — safely replicate RPI workflow scaffolding

USAGE:
  rpi-cloner [OPTIONS]

OPTIONS:
  --dry-run              Scan target for conflicts without writing (default mode)
  --check                Alias for --dry-run
  --apply                Copy scaffold files to target (aborts on any conflict)
  --target <path>        Target repository path (required)
  --report-format <fmt>  Output format: json | text (default: text)
  --help                 Show this help

EXAMPLES:
  # Scan for conflicts
  rpi-cloner --dry-run --target /path/to/repo

  # Apply scaffold (fail-fast on conflict)
  rpi-cloner --apply --target /path/to/repo

  # JSON conflict report
  rpi-cloner --check --target /path/to/repo --report-format json
`;

async function main() {
	try {
		const { values } = parseArgs({
			options: {
				"dry-run": { type: "boolean", default: false },
				check: { type: "boolean", default: false },
				apply: { type: "boolean", default: false },
				target: { type: "string" },
				"report-format": { type: "string", default: "text" },
				help: { type: "boolean", default: false },
			},
		});

		if (values.help) {
			console.log(USAGE);
			process.exit(0);
		}

		if (!values.target) {
			console.error("Error: --target <path> is required\n");
			console.log(USAGE);
			process.exit(1);
		}

		const mode = values.apply ? "apply" : "dry-run";
		const format = values["report-format"];
		const targetPath = resolve(values.target);
		const sourcePath = resolve(__dirname, "..");

		// Always scan first (dry-run or pre-apply check)
		const scanResult = await scan(sourcePath, targetPath);

		if (scanResult.conflicts.length > 0) {
			// Conflicts found — report and exit non-zero
			const report = formatReport(scanResult, format);
			console.log(report);

			if (mode === "apply") {
				console.error(
					"\n❌ Apply aborted: conflicts detected. Resolve manually and retry.",
				);
			}

			process.exit(1);
		}

		if (mode === "dry-run") {
			const report = formatReport(scanResult, format);
			console.log(report);

			// Only add success message for text format
			if (format === "text") {
				console.log("\n✅ No conflicts detected. Safe to apply.");
			}

			process.exit(0);
		}

		// Apply mode with no conflicts — proceed with copy
		const copyResult = await copy(sourcePath, targetPath, scanResult.manifest);
		console.log(
			`\n✅ Successfully copied ${copyResult.filesWritten} files to ${targetPath}`,
		);
		process.exit(0);
	} catch (error) {
		console.error("Fatal error:", error.message);
		if (process.env.DEBUG) {
			console.error(error.stack);
		}
		process.exit(2);
	}
}

main();

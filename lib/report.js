/**
 * Format scan results as text or JSON report.
 *
 * @param {Object} scanResult - Result from scan()
 * @param {string} format - 'text' | 'json'
 * @returns {string}
 */
export function formatReport(scanResult, format = "text") {
	if (format === "json") {
		return JSON.stringify(scanResult, null, 2);
	}

	// Text format
	const lines = [];
	lines.push("RPI Scaffold Cloner — Scan Report");
	lines.push("=".repeat(60));
	lines.push("");
	lines.push(`Total paths in manifest: ${scanResult.summary.total}`);
	lines.push(`Clean (safe to copy):    ${scanResult.summary.clean}`);
	lines.push(`Conflicts detected:      ${scanResult.summary.conflicts}`);
	lines.push("");

	if (scanResult.conflicts.length > 0) {
		lines.push("CONFLICTS");
		lines.push("-".repeat(60));
		lines.push("");

		for (const conflict of scanResult.conflicts) {
			lines.push(`Path: ${conflict.path}`);
			lines.push(`  Target: ${conflict.targetPath}`);

			if (conflict.error) {
				lines.push(`  Error: ${conflict.error} (${conflict.errorCode})`);
			} else {
				lines.push(
					`  Discovered: ${conflict.discovered.type} (${conflict.discovered.size} bytes)`,
				);
				lines.push(
					`  Expected:   ${conflict.expected.type} (${conflict.expected.size} bytes)`,
				);
			}

			lines.push("");
			lines.push(
				"  ⚠️  Resolution: Resolve manually in target project, then retry.",
			);
			lines.push("");
		}
	} else {
		lines.push("✅ No conflicts detected.");
		lines.push("");
		lines.push("Clean paths:");
		for (const path of scanResult.clean) {
			lines.push(`  ${path}`);
		}
	}

	lines.push("");
	lines.push("=".repeat(60));

	return lines.join("\n");
}

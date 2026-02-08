import { lstat, readFile } from "node:fs/promises";
import { join, normalize } from "node:path";

/**
 * Scan target directory for conflicts before copying scaffold files.
 *
 * @param {string} sourcePath - Absolute path to source repository
 * @param {string} targetPath - Absolute path to target repository
 * @returns {Promise<{manifest: string[], conflicts: Array, clean: Array}>}
 */
export async function scan(sourcePath, targetPath) {
	// Load manifest
	const manifestPath = join(sourcePath, "manifest", "scaffold.json");
	const manifestContent = await readFile(manifestPath, "utf-8");
	const manifest = JSON.parse(manifestContent);
	const paths = manifest.paths;

	const conflicts = [];
	const clean = [];

	// Check each path in manifest
	for (const relPath of paths) {
		const targetFilePath = join(targetPath, relPath);
		const sourceFilePath = join(sourcePath, relPath);

		// Normalize for case-insensitive FS comparison
		const _normalizedTarget = normalize(targetFilePath).toLowerCase();

		try {
			// Check if file exists at target
			const stats = await lstat(targetFilePath);

			// Get source stats for comparison
			let sourceStats;
			try {
				sourceStats = await lstat(sourceFilePath);
			} catch {
				// Source doesn't exist - skip this entry
				continue;
			}

			// Conflict detected
			conflicts.push({
				path: relPath,
				targetPath: targetFilePath,
				sourcePath: sourceFilePath,
				discovered: {
					type: stats.isSymbolicLink()
						? "symlink"
						: stats.isDirectory()
							? "directory"
							: "file",
					size: stats.size,
					mode: stats.mode,
				},
				expected: {
					type: sourceStats.isSymbolicLink()
						? "symlink"
						: sourceStats.isDirectory()
							? "directory"
							: "file",
					size: sourceStats.size,
				},
			});
		} catch (err) {
			if (err.code === "ENOENT") {
				// Target doesn't exist - safe to copy
				clean.push(relPath);
			} else {
				// Other error (permissions, etc.)
				conflicts.push({
					path: relPath,
					targetPath: targetFilePath,
					error: err.message,
					errorCode: err.code,
				});
			}
		}
	}

	return {
		manifest: paths,
		conflicts,
		clean,
		summary: {
			total: paths.length,
			conflicts: conflicts.length,
			clean: clean.length,
		},
	};
}

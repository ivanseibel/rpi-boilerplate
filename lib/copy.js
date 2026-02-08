import {
	chmod,
	copyFile,
	lstat,
	mkdir,
	readlink,
	symlink,
} from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * Copy scaffold files from source to target, preserving symlinks and permissions.
 *
 * WARNING: This function assumes scan() has already validated no conflicts exist.
 * It will overwrite files if called without prior validation.
 *
 * @param {string} sourcePath - Absolute path to source repository
 * @param {string} targetPath - Absolute path to target repository
 * @param {string[]} manifestPaths - List of relative paths to copy
 * @returns {Promise<{filesWritten: number, symlinksCopied: number, errors: Array}>}
 */
export async function copy(sourcePath, targetPath, manifestPaths) {
	let filesWritten = 0;
	let symlinksCopied = 0;
	const errors = [];

	for (const relPath of manifestPaths) {
		const sourceFile = join(sourcePath, relPath);
		const targetFile = join(targetPath, relPath);

		try {
			// Ensure target directory exists
			const targetDir = dirname(targetFile);
			await mkdir(targetDir, { recursive: true });

			// Check if source is a symlink
			const stats = await lstat(sourceFile);

			if (stats.isSymbolicLink()) {
				// Preserve symlink
				const linkTarget = await readlink(sourceFile);
				await symlink(linkTarget, targetFile);
				symlinksCopied++;
			} else if (stats.isFile()) {
				// Copy file and preserve executable bit
				await copyFile(sourceFile, targetFile);

				// Preserve executable permission
				const mode = stats.mode;
				await chmod(targetFile, mode);

				filesWritten++;
			} else if (stats.isDirectory()) {
				// Create directory (files within will be copied by manifest entries)
				await mkdir(targetFile, { recursive: true });
			}
		} catch (err) {
			errors.push({
				path: relPath,
				source: sourceFile,
				target: targetFile,
				error: err.message,
				code: err.code,
			});
		}
	}

	return {
		filesWritten,
		symlinksCopied,
		errors,
	};
}

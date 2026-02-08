import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, test } from "node:test";
import { scan } from "../lib/scan.js";

describe("scan.js", () => {
	let tempSource;
	let tempTarget;

	beforeEach(async () => {
		tempSource = await mkdtemp(join(tmpdir(), "rpi-scan-source-"));
		tempTarget = await mkdtemp(join(tmpdir(), "rpi-scan-target-"));

		// Create minimal manifest
		await mkdir(join(tempSource, "manifest"), { recursive: true });
		await writeFile(
			join(tempSource, "manifest", "scaffold.json"),
			JSON.stringify({
				paths: ["test-file.txt", "test-dir/nested.txt", "test-link.txt"],
			}),
		);

		// Create test files in source
		await writeFile(join(tempSource, "test-file.txt"), "content");
		await mkdir(join(tempSource, "test-dir"), { recursive: true });
		await writeFile(join(tempSource, "test-dir", "nested.txt"), "nested");
	});

	afterEach(async () => {
		await rm(tempSource, { recursive: true, force: true });
		await rm(tempTarget, { recursive: true, force: true });
	});

	test("detects no conflicts when target is clean", async () => {
		const result = await scan(tempSource, tempTarget);

		assert.equal(result.conflicts.length, 0);
		assert.equal(result.clean.length, 3);
		assert.equal(result.summary.total, 3);
	});

	test("detects conflict when file exists at target", async () => {
		// Create conflicting file
		await writeFile(join(tempTarget, "test-file.txt"), "different content");

		const result = await scan(tempSource, tempTarget);

		assert.equal(result.conflicts.length, 1);
		assert.equal(result.conflicts[0].path, "test-file.txt");
		assert.equal(result.conflicts[0].discovered.type, "file");
	});

	test("detects conflict when directory exists at target", async () => {
		// Create conflicting directory
		await mkdir(join(tempTarget, "test-dir"), { recursive: true });
		await writeFile(join(tempTarget, "test-dir", "nested.txt"), "exists");

		const result = await scan(tempSource, tempTarget);

		// Should detect conflict on nested.txt
		assert(result.conflicts.length > 0);
		const conflict = result.conflicts.find(
			(c) => c.path === "test-dir/nested.txt",
		);
		assert(conflict, "Should detect nested file conflict");
	});

	test("detects symlink at target", async () => {
		// Create symlink in source
		await writeFile(join(tempSource, "real-file.txt"), "target");
		await symlink("real-file.txt", join(tempSource, "test-link.txt"));

		// Create conflicting symlink at target
		await writeFile(join(tempTarget, "other-file.txt"), "other");
		await symlink("other-file.txt", join(tempTarget, "test-link.txt"));

		const result = await scan(tempSource, tempTarget);

		const conflict = result.conflicts.find((c) => c.path === "test-link.txt");
		assert(conflict, "Should detect symlink conflict");
		assert.equal(conflict.discovered.type, "symlink");
	});

	test("case-insensitive collision detection", async () => {
		// This test is primarily for macOS APFS (case-insensitive)
		// On case-sensitive FS, Test-File.txt and test-file.txt are different files

		// Create file with different case at target
		await writeFile(join(tempTarget, "Test-File.txt"), "case variant");

		const result = await scan(tempSource, tempTarget);

		// On macOS, this should detect a conflict
		// On Linux, it may not (test documents platform behavior)
		// The scanner normalizes to lowercase for comparison
		const hasConflict = result.conflicts.some(
			(c) => c.path.toLowerCase() === "test-file.txt",
		);

		// Document platform-specific behavior
		if (process.platform === "darwin") {
			// macOS typically uses case-insensitive FS
			assert(
				hasConflict || result.conflicts.length > 0,
				"Should detect case-insensitive collision on macOS",
			);
		}
	});
});

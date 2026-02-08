import assert from "node:assert/strict";
import {
	chmod,
	lstat,
	mkdir,
	mkdtemp,
	readFile,
	readlink,
	rm,
	symlink,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, test } from "node:test";
import { copy } from "../lib/copy.js";

describe("copy.js", () => {
	let tempSource;
	let tempTarget;

	beforeEach(async () => {
		tempSource = await mkdtemp(join(tmpdir(), "rpi-copy-source-"));
		tempTarget = await mkdtemp(join(tmpdir(), "rpi-copy-target-"));
	});

	afterEach(async () => {
		await rm(tempSource, { recursive: true, force: true });
		await rm(tempTarget, { recursive: true, force: true });
	});

	test("copies simple file", async () => {
		const testContent = "test content";
		await writeFile(join(tempSource, "test.txt"), testContent);

		const result = await copy(tempSource, tempTarget, ["test.txt"]);

		assert.equal(result.filesWritten, 1);
		const copied = await readFile(join(tempTarget, "test.txt"), "utf-8");
		assert.equal(copied, testContent);
	});

	test("copies nested files and creates directories", async () => {
		await mkdir(join(tempSource, "dir", "nested"), { recursive: true });
		await writeFile(join(tempSource, "dir", "nested", "file.txt"), "nested");

		const result = await copy(tempSource, tempTarget, ["dir/nested/file.txt"]);

		assert.equal(result.filesWritten, 1);
		const copied = await readFile(
			join(tempTarget, "dir", "nested", "file.txt"),
			"utf-8",
		);
		assert.equal(copied, "nested");
	});

	test("preserves symlinks", async () => {
		await writeFile(join(tempSource, "target.txt"), "link target");
		await mkdir(join(tempSource, "links"), { recursive: true });
		const linkPath = join(tempSource, "links", "link.txt");
		await writeFile(join(tempSource, "links", "link.txt"), ""); // Create file first
		await rm(linkPath); // Remove it
		await symlink("../target.txt", linkPath); // Create symlink

		const result = await copy(tempSource, tempTarget, ["links/link.txt"]);

		assert.equal(result.symlinksCopied, 1);

		const copiedLinkPath = join(tempTarget, "links", "link.txt");
		const stats = await lstat(copiedLinkPath);
		assert(stats.isSymbolicLink(), "Should preserve symlink");

		const linkTarget = await readlink(copiedLinkPath);
		assert.equal(linkTarget, "../target.txt");
	});

	test("preserves executable bit", async () => {
		const scriptPath = join(tempSource, "script.sh");
		await writeFile(scriptPath, "#!/bin/bash\necho test");
		await chmod(scriptPath, 0o755); // Make executable

		const result = await copy(tempSource, tempTarget, ["script.sh"]);

		assert.equal(result.filesWritten, 1);

		const copiedPath = join(tempTarget, "script.sh");
		const stats = await lstat(copiedPath);

		// Check executable bit (owner)
		const isExecutable = (stats.mode & 0o100) !== 0;
		assert(isExecutable, "Should preserve executable bit");
	});

	test("handles multiple files", async () => {
		await writeFile(join(tempSource, "file1.txt"), "one");
		await writeFile(join(tempSource, "file2.txt"), "two");
		await mkdir(join(tempSource, "dir"), { recursive: true });
		await writeFile(join(tempSource, "dir", "file3.txt"), "three");

		const result = await copy(tempSource, tempTarget, [
			"file1.txt",
			"file2.txt",
			"dir/file3.txt",
		]);

		assert.equal(result.filesWritten, 3);
		assert.equal(result.errors.length, 0);
	});

	test("reports errors for missing source files", async () => {
		const result = await copy(tempSource, tempTarget, ["nonexistent.txt"]);

		assert.equal(result.filesWritten, 0);
		assert.equal(result.errors.length, 1);
		assert.equal(result.errors[0].path, "nonexistent.txt");
	});
});

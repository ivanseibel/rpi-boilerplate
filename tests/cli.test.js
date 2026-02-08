import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLI_PATH = join(__dirname, "..", "bin", "rpi-cloner.js");

describe("CLI integration", () => {
	let tempTarget;

	beforeEach(async () => {
		tempTarget = await mkdtemp(join(tmpdir(), "rpi-cli-target-"));
	});

	afterEach(async () => {
		await rm(tempTarget, { recursive: true, force: true });
	});

	test("--help shows usage", async () => {
		const { stdout } = await execFileAsync("node", [CLI_PATH, "--help"]);

		assert(stdout.includes("RPI Scaffold Cloner"));
		assert(stdout.includes("--dry-run"));
		assert(stdout.includes("--apply"));
		assert(stdout.includes("--target"));
	});

	test("requires --target flag", async () => {
		try {
			await execFileAsync("node", [CLI_PATH, "--dry-run"]);
			assert.fail("Should require --target flag");
		} catch (error) {
			assert(error.stderr.includes("--target"));
			assert.equal(error.code, 1);
		}
	});

	test("--dry-run detects clean target", async () => {
		const { stdout } = await execFileAsync("node", [
			CLI_PATH,
			"--dry-run",
			"--target",
			tempTarget,
		]);

		assert(stdout.includes("No conflicts detected"));
	});

	test("--dry-run detects conflicts", async () => {
		// Create conflicting file
		await writeFile(join(tempTarget, "AGENTS.md"), "existing content");

		try {
			await execFileAsync("node", [
				CLI_PATH,
				"--dry-run",
				"--target",
				tempTarget,
			]);
			assert.fail("Should exit non-zero on conflicts");
		} catch (error) {
			assert(error.stdout.includes("CONFLICTS"));
			assert(error.stdout.includes("AGENTS.md"));
			assert.equal(error.code, 1);
		}
	});

	test("--apply aborts on conflicts without writing", async () => {
		// Create conflicting file
		const conflictContent = "existing conflict";
		await writeFile(join(tempTarget, "AGENTS.md"), conflictContent);

		try {
			await execFileAsync("node", [
				CLI_PATH,
				"--apply",
				"--target",
				tempTarget,
			]);
			assert.fail("Should abort on conflicts");
		} catch (error) {
			assert(error.stderr.includes("aborted"));
			assert.equal(error.code, 1);

			// Verify no files were written/modified
			const stillConflicted = await readFile(
				join(tempTarget, "AGENTS.md"),
				"utf-8",
			);
			assert.equal(
				stillConflicted,
				conflictContent,
				"Should not modify conflicting file",
			);
		}
	});

	test("--apply copies files when clean", async () => {
		const { stdout } = await execFileAsync("node", [
			CLI_PATH,
			"--apply",
			"--target",
			tempTarget,
		]);

		assert(stdout.includes("Successfully copied"));

		// Verify some files were copied
		const agentsMd = await readFile(join(tempTarget, "AGENTS.md"), "utf-8");
		assert(agentsMd.length > 0);
	});

	test("--report-format json produces valid JSON", async () => {
		const { stdout } = await execFileAsync("node", [
			CLI_PATH,
			"--dry-run",
			"--target",
			tempTarget,
			"--report-format",
			"json",
		]);

		// Parse JSON output
		const report = JSON.parse(stdout.trim());
		assert(report.summary);
		assert(typeof report.summary.total === "number");
	});
});

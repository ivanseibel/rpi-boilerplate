import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { formatReport } from "../lib/report.js";

describe("report.js", () => {
	test("formats clean scan as text", () => {
		const scanResult = {
			manifest: ["file1.txt", "file2.txt"],
			conflicts: [],
			clean: ["file1.txt", "file2.txt"],
			summary: {
				total: 2,
				conflicts: 0,
				clean: 2,
			},
		};

		const report = formatReport(scanResult, "text");

		assert(report.includes("No conflicts detected"));
		assert(report.includes("file1.txt"));
		assert(report.includes("file2.txt"));
	});

	test("formats conflicts as text", () => {
		const scanResult = {
			manifest: ["file1.txt"],
			conflicts: [
				{
					path: "file1.txt",
					targetPath: "/target/file1.txt",
					discovered: {
						type: "file",
						size: 100,
					},
					expected: {
						type: "file",
						size: 50,
					},
				},
			],
			clean: [],
			summary: {
				total: 1,
				conflicts: 1,
				clean: 0,
			},
		};

		const report = formatReport(scanResult, "text");

		assert(report.includes("CONFLICTS"));
		assert(report.includes("file1.txt"));
		assert(report.includes("100 bytes"));
		assert(report.includes("Resolve manually"));
	});

	test("formats scan result as JSON", () => {
		const scanResult = {
			manifest: ["file1.txt"],
			conflicts: [],
			clean: ["file1.txt"],
			summary: {
				total: 1,
				conflicts: 0,
				clean: 1,
			},
		};

		const report = formatReport(scanResult, "json");
		const parsed = JSON.parse(report);

		assert.equal(parsed.summary.total, 1);
		assert.equal(parsed.summary.conflicts, 0);
		assert.equal(parsed.clean.length, 1);
	});

	test("includes guidance text for conflicts", () => {
		const scanResult = {
			manifest: ["test.txt"],
			conflicts: [
				{
					path: "test.txt",
					targetPath: "/target/test.txt",
					discovered: { type: "file", size: 10 },
					expected: { type: "file", size: 20 },
				},
			],
			clean: [],
			summary: { total: 1, conflicts: 1, clean: 0 },
		};

		const report = formatReport(scanResult, "text");

		assert(report.includes("Resolution:"));
		assert(report.includes("Resolve manually"));
		assert(report.includes("retry"));
	});
});

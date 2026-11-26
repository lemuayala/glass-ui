#!/usr/bin/env node
/**
 * Prints the CHANGELOG.md section for a version (used as GitHub Release notes).
 *
 *   node scripts/changelog-section.mjs [version]   (default: root package.json version)
 *
 * Exits 1 when the section is missing or empty, so CI can require an entry for every version bump.
 */
import { readFile } from "node:fs/promises"

const root = new URL("../", import.meta.url)
const version = process.argv[2] ?? JSON.parse(await readFile(new URL("package.json", root), "utf8")).version
const changelog = (await readFile(new URL("CHANGELOG.md", root), "utf8")).replace(/\r\n/g, "\n")

const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const match = changelog.match(new RegExp(`^## \\[${escaped}\\][^\\n]*\\n([\\s\\S]*?)(?=^## \\[|^\\[[^\\]]+\\]: )`, "m"))
const body = match?.[1].trim()

if (!body) {
  console.error(`CHANGELOG.md has no entry for ${version}. Add a "## [${version}] - YYYY-MM-DD" section.`)
  process.exit(1)
}
process.stdout.write(`${body}\n`)

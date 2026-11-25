#!/usr/bin/env node
import { runGlassCli } from "./cli-runner.js"

const code = runGlassCli(process.argv.slice(2), {
  cwd: process.cwd(),
  stdout: (msg) => process.stdout.write(`${msg}\n`),
  stderr: (msg) => process.stderr.write(`${msg}\n`),
})

process.exitCode = code

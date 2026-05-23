/**
 * Export app icons → apple-icon.png (dark) + apple-icon-light.png (light) + og-image.png.
 * Run: pnpm icons:export
 */
import sharp from "sharp"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const publicDir = join(root, "public")

const jobs = [
  { svg: "app-icon.svg", out: "apple-icon.png", width: 180, height: 180, fit: "contain" },
  { svg: "app-icon-light.svg", out: "apple-icon-light.png", width: 180, height: 180, fit: "contain" },
  { svg: "app-icon.svg", out: "og-image.png", width: 1200, height: 630, fit: "cover" },
]

for (const job of jobs) {
  const input = readFileSync(join(publicDir, job.svg))
  await sharp(input, { density: 384 })
    .resize(job.width, job.height, {
      fit: job.fit,
      position: "centre",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(join(publicDir, job.out))
  console.log(`✓ ${job.out}`)
}

import { describe, expect, it } from "vitest"
import { GET, generateStaticParams } from "./route"

const call = (item: string) => GET(new Request(`http://localhost/r/${item}`), { params: Promise.resolve({ item }) })

describe("/r/[item] registry route", () => {
  it("statically generates the index and every item", () => {
    const params = generateStaticParams().map((p) => p.item)
    expect(params).toContain("registry.json")
    expect(params).toContain("glass-ui.json")
    expect(params).toContain("glass-card.json")
    expect(params).toContain("glass-card-liquid-native.json")
  })

  it("serves the registry index", async () => {
    const res = await call("registry.json")
    expect(res.status).toBe(200)
    expect(res.headers.get("access-control-allow-origin")).toBe("*")
    const body = await res.json()
    expect(body.name).toBe("glass-ui")
    expect(body.items.length).toBeGreaterThan(90)
  })

  it("serves an item with its component source", async () => {
    const res = await call("glass-card.json")
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.name).toBe("glass-card")
    expect(body.files[0].content).toMatch(/export const GlassCard\b/)
  })

  it("404s for unknown items", async () => {
    expect((await call("nope.json")).status).toBe(404)
    expect((await call("glass-card")).status).toBe(404)
  })
})

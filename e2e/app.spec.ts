import { expect, test } from "@playwright/test"

test.describe("Glass UI production E2E suite", () => {
  test("landing page loads with zero runtime errors and navigates to /play", async ({
    page,
  }, testInfo) => {
    const errors: string[] = []
    page.on("pageerror", (err) => errors.push(err.message))

    await page.goto("/")
    await expect(page.locator("h1")).toBeVisible()

    const isMobileProject = testInfo.project.name.includes("mobile")
    if (isMobileProject) {
      await expect(page.locator("html")).toHaveClass(/gg-viewport-mobile/)
      await expect(page.locator("html")).toHaveClass(/gg-landing-lite/)
    } else {
      await expect(page.locator("html")).toHaveClass(/gg-viewport-desktop/)
    }

    await page.locator('a[href="/play"]').first().click()
    await expect(page).toHaveURL(/\/play/)
    await expect(page.locator("#playground-preview")).toBeVisible()
    expect(errors).toEqual([])
  })

  test("legacy share URL /?c=switch&pl=native redirects to /play preserving state", async ({
    page,
  }, testInfo) => {
    await page.goto("/?c=switch&pl=native&tn=teal")
    await expect(page).toHaveURL(/\/play\?.*c=switch.*pl=native/)

    const isMobileProject = testInfo.project.name.includes("mobile")
    if (isMobileProject) {
      // Switch to Code tab on mobile layout
      await page.getByRole("tablist").first().getByRole("tab").nth(2).click()
    }

    const codeRegion = page.locator("section").nth(2)
    await expect(codeRegion).toContainText("GlassSwitch")
    await expect(codeRegion).toContainText("react-native")
  })

  test("playground enforces mobile layout contract without horizontal overflow", async ({
    page,
  }, testInfo) => {
    await page.goto("/play")

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    )
    expect(hasOverflow).toBe(false)

    if (testInfo.project.name.includes("mobile")) {
      await expect(page.getByRole("tablist").first()).toBeVisible()
      await expect(page.getByRole("tablist").nth(1)).toBeVisible()
    }
  })

  test("SEO and redirect endpoints respond cleanly", async ({ request }) => {
    const robotsRes = await request.get("/robots.txt")
    expect(robotsRes.ok()).toBe(true)
    expect(await robotsRes.text()).toContain("Sitemap:")

    const sitemapRes = await request.get("/sitemap.xml")
    expect(sitemapRes.ok()).toBe(true)
    const xml = await sitemapRes.text()
    expect(xml).toContain("/play")
  })
})

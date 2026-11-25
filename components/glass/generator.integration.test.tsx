import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Providers } from "@/components/providers"
import { Generator } from "./generator"

describe("<Generator /> full playground integration", () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState(null, "", "/play")
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ stargazers_count: 128 }), { status: 200 }),
    )
  })

  it("switches components, toggles Web/Native & Inline/Reusable, and updates code output", async () => {
    const user = userEvent.setup()
    render(
      <Providers>
        <Generator />
      </Providers>,
    )

    const codeSection = screen.getByLabelText("Code")
    expect(codeSection).toHaveTextContent("glassCardVariants")

    // Switch to Button via keyboard shortcut "2"
    await user.keyboard("2")
    expect(codeSection).toHaveTextContent("glassButtonVariants")

    // Switch platform to Native
    await user.click(within(codeSection).getByRole("button", { name: "Native" }))
    expect(codeSection).toHaveTextContent("react-native")

    // Switch export mode to Inline
    await user.click(within(codeSection).getByRole("button", { name: "Inline" }))
    expect(codeSection).toHaveTextContent("export function Example()")
  })

  it("applies preset, renders active preset in GLASS.md, and copies prompt to clipboard", async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined)

    render(
      <Providers>
        <Generator />
      </Providers>,
    )

    // Open Presets via shortcut "p" and pick Liquid Glass
    await user.keyboard("p")
    const listbox = screen.getByRole("listbox")
    await user.click(within(listbox).getByText("Liquid Glass"))

    // Switch to GLASS.md tab
    const codeSection = screen.getByLabelText("Code")
    await user.click(within(codeSection).getByRole("button", { name: "GLASS.md" }))

    expect(within(codeSection).getByLabelText("Download GLASS.md")).toBeInTheDocument()

    await user.click(within(codeSection).getByLabelText("Copy GLASS.md"))
    expect(writeText).toHaveBeenCalledTimes(1)
    const copiedMd = writeText.mock.calls[0]?.[0] ?? ""
    expect(copiedMd).toContain("# GLASS.md — GlassCard")
    expect(copiedMd).toContain("| Preset | Liquid Glass |")
  })

  it("opens keyboard shortcuts dialog with ? and toggles EN/ES locale with L", async () => {
    const user = userEvent.setup()
    window.localStorage.setItem("glass-ui-locale", "en")

    render(
      <Providers>
        <Generator />
      </Providers>,
    )

    await user.keyboard("?")
    expect(screen.getByText("Keyboard shortcuts")).toBeInTheDocument()

    await user.keyboard("{Escape}")
    expect(screen.queryByText("Keyboard shortcuts")).not.toBeInTheDocument()

    await user.keyboard("l")
    expect(screen.getByLabelText("Propiedades")).toBeInTheDocument()
  })
})

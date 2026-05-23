/** Logical viewport — iPhone 17 Pro Max (matches playground target). */
export const IPHONE_17_PRO_MAX = {
  width: 440,
  height: 956,
  radius: "3rem",
} as const

/** iPad Pro 11" portrait logical frame (playground preview). */
export const IPAD_PRO_11 = {
  width: 834,
  height: 1194,
  radius: "2.5rem",
} as const

export type PreviewDeviceFrame = "iphone" | "ipad" | "none"

export const PREVIEW_DEVICE_FRAMES: Record<
  Exclude<PreviewDeviceFrame, "none">,
  { width: number; height: number; radius: string }
> = {
  iphone: IPHONE_17_PRO_MAX,
  ipad: IPAD_PRO_11,
}

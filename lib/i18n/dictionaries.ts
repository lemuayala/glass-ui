/**
 * Tiny dictionary-based i18n. No external deps.
 * Add a key, translate it for both locales, done.
 */

export const LOCALES = ["en", "es"] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  es: "ES",
}

export const dictionaries = {
  en: {
    "brand.name": "Glass UI",
    "brand.tagline": "Glassmorphism Generator",

    "nav.card": "Card",
    "nav.button": "Button",
    "nav.input": "Input",
    "nav.modal": "Modal",
    "nav.tabbar": "Tab Bar",

    "actions.share": "Share",
    "actions.copied": "Copied",
    "actions.star": "Star",
    "actions.presets": "Presets",
    "actions.copy": "Copy",
    "actions.download": "Download .tsx",
    "actions.reset": "Reset",
    "actions.theme.light": "Light theme",
    "actions.theme.dark": "Dark theme",
    "actions.locale": "Language",
    "actions.shortcuts": "Keyboard shortcuts",

    "share.toast.title": "Link copied to clipboard",
    "share.toast.description":
      "Share your design with a friend or teammate — they'll see exactly what you see.",
    "share.toast.action": "Open",
    "code.toast.title": "Code copied",
    "code.toast.description": "Paste it into your project and you're good to go.",

    "panel.properties": "Properties",
    "panel.code": "Code",
    "panel.preview": "Preview",
    "panel.theme": "Theme",
    "panel.tint": "Tint",
    "panel.blur": "Blur",
    "panel.intensity": "Intensity",
    "panel.intensity.desc": "Background opacity",
    "panel.radius": "Radius",
    "panel.border": "Border",
    "panel.size": "Size",
    "panel.size.desc": "Height + horizontal padding",
    "panel.padding": "Padding",
    "panel.padding.desc": "Inner spacing",
    "panel.height": "Height",
    "panel.height.desc": "Bar height",
    "panel.shadow": "Shadow",
    "panel.title": "Title",
    "panel.label": "Label",
    "panel.placeholder": "Placeholder",
    "panel.theme.light": "Light",
    "panel.theme.dark": "Dark",
    "panel.footer":
      "Every change updates the live preview, the URL and the exported code. All utilities are NativeWind-compatible.",

    "code.inline": "Inline",
    "code.reusable": "Reusable",

    "preview.wallpaper": "Wallpaper",
    "preview.wallpaper.upload": "Upload image",
    "preview.wallpaper.uploading": "Loading…",
    "preview.wallpaper.tooLarge": "Image is too large (max 5 MB)",
    "preview.dragHint": "Drag to test transparency",
    "preview.toggleBackdrop.show": "Show backdrop content",
    "preview.toggleBackdrop.hide": "Hide backdrop content",
    "preview.resetPosition": "Reset position",

    "presets.title": "Curated styles",
    "presets.frosted.name": "Frosted",
    "presets.frosted.description": "Soft & airy — Apple Music card vibe",
    "presets.liquid.name": "Liquid Glass",
    "presets.liquid.description": "iOS 26 tinted blue — heavy blur",
    "presets.smoked.name": "Smoked",
    "presets.smoked.description": "Dark theatre — minimal & moody",
    "presets.crystal.name": "Crystal",
    "presets.crystal.description": "Crisp light — clean & flat",
    "presets.sunset.name": "Sunset",
    "presets.sunset.description": "Warm orange tint — playful & bold",
    "presets.aqua.name": "Aqua",
    "presets.aqua.description": "Teal-tinted depth — fresh & elegant",

    "shortcuts.title": "Keyboard shortcuts",
    "shortcuts.components": "Switch component",
    "shortcuts.theme": "Toggle component theme",
    "shortcuts.presets": "Open presets",
    "shortcuts.share": "Copy share link",
    "shortcuts.locale": "Toggle language",
    "shortcuts.appTheme": "Toggle app theme",
    "shortcuts.close": "Close dialogs",

    "footer.text":
      "Built for React Native + NativeWind. Tailwind on the web works too.",
  },
  es: {
    "brand.name": "Glass UI",
    "brand.tagline": "Generador Glassmorphism",

    "nav.card": "Tarjeta",
    "nav.button": "Botón",
    "nav.input": "Input",
    "nav.modal": "Modal",
    "nav.tabbar": "Tab Bar",

    "actions.share": "Compartir",
    "actions.copied": "Copiado",
    "actions.star": "Estrella",
    "actions.presets": "Presets",
    "actions.copy": "Copiar",
    "actions.download": "Descargar .tsx",
    "actions.reset": "Reset",
    "actions.theme.light": "Tema claro",
    "actions.theme.dark": "Tema oscuro",
    "actions.locale": "Idioma",
    "actions.shortcuts": "Atajos de teclado",

    "share.toast.title": "Link copiado al portapapeles",
    "share.toast.description":
      "Comparte este diseño con un amigo o compañero — verá exactamente lo mismo que tú.",
    "share.toast.action": "Abrir",
    "code.toast.title": "Código copiado",
    "code.toast.description": "Pégalo en tu proyecto y listo.",

    "panel.properties": "Propiedades",
    "panel.code": "Código",
    "panel.preview": "Preview",
    "panel.theme": "Tema",
    "panel.tint": "Tinte",
    "panel.blur": "Blur",
    "panel.intensity": "Intensidad",
    "panel.intensity.desc": "Opacidad del fondo",
    "panel.radius": "Radio",
    "panel.border": "Borde",
    "panel.size": "Tamaño",
    "panel.size.desc": "Alto + padding horizontal",
    "panel.padding": "Padding",
    "panel.padding.desc": "Espaciado interno",
    "panel.height": "Alto",
    "panel.height.desc": "Alto de la barra",
    "panel.shadow": "Sombra",
    "panel.title": "Título",
    "panel.label": "Etiqueta",
    "panel.placeholder": "Placeholder",
    "panel.theme.light": "Claro",
    "panel.theme.dark": "Oscuro",
    "panel.footer":
      "Cada cambio actualiza la preview, la URL y el código exportado. Todas las utilidades son compatibles con NativeWind.",

    "code.inline": "Inline",
    "code.reusable": "Reutilizable",

    "preview.wallpaper": "Wallpaper",
    "preview.wallpaper.upload": "Subir imagen",
    "preview.wallpaper.uploading": "Cargando…",
    "preview.wallpaper.tooLarge": "La imagen es demasiado grande (máx 5 MB)",
    "preview.dragHint": "Arrastra para ver la transparencia",
    "preview.toggleBackdrop.show": "Mostrar contenido detrás",
    "preview.toggleBackdrop.hide": "Ocultar contenido detrás",
    "preview.resetPosition": "Reiniciar posición",

    "presets.title": "Estilos curados",
    "presets.frosted.name": "Frosted",
    "presets.frosted.description": "Suave y aireado — vibe Apple Music",
    "presets.liquid.name": "Liquid Glass",
    "presets.liquid.description": "iOS 26 azul — blur intenso",
    "presets.smoked.name": "Smoked",
    "presets.smoked.description": "Oscuro y elegante — minimal",
    "presets.crystal.name": "Crystal",
    "presets.crystal.description": "Luz nítida — limpio y plano",
    "presets.sunset.name": "Sunset",
    "presets.sunset.description": "Tinte naranja — cálido y atrevido",
    "presets.aqua.name": "Aqua",
    "presets.aqua.description": "Profundidad turquesa — fresco",

    "shortcuts.title": "Atajos de teclado",
    "shortcuts.components": "Cambiar componente",
    "shortcuts.theme": "Tema del componente",
    "shortcuts.presets": "Abrir presets",
    "shortcuts.share": "Copiar link",
    "shortcuts.locale": "Cambiar idioma",
    "shortcuts.appTheme": "Tema de la app",
    "shortcuts.close": "Cerrar diálogos",

    "footer.text":
      "Hecho para React Native + NativeWind. También funciona con Tailwind en web.",
  },
} as const

export type TranslationKey = keyof (typeof dictionaries)["en"]

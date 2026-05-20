type ProjectThemeConfig = {
  id: string
  label: string
  brandAccent: {
    hex: string
    lightOklch: string
    darkOklch: string
  }
  theme: {
    initialDocsTheme: string
  }
}

export const projectConfig = {
  id: "genesis-render",
  label: "genesis-render",
  brandAccent: {
    hex: "#10b981",
    lightOklch: "oklch(0.596 0.145 163.225)",
    darkOklch: "oklch(0.765 0.177 163.223)",
  },
  theme: {
    initialDocsTheme: "emerald",
  },
} as const satisfies ProjectThemeConfig

export const projectThemeStyleCss = `:root {
  --project-brand-accent: ${projectConfig.brandAccent.lightOklch};
  --project-brand-accent-dark: ${projectConfig.brandAccent.darkOklch};
}`

export const projectBanner = {
  segments: [
    { text: "genesis", colorHex: projectConfig.brandAccent.hex },
    { text: "render" },
  ],
}

/*
  site-theme.js
  ----------------------------------------------------------------------------
  One theme for the whole site, picked from the nav bar.

  Every page used to carry its own palette — the TOPIK pages navy, the home
  page forest, HowToStudyKorean lemon, each 숭실대 class its own — and a
  floating ☾/☀ button that flipped between that palette and a dark one. The
  palettes now live here, every page wears whichever one is picked, and the
  choice follows you from page to page and tab to tab.

  Load it as the first script in <head>, before the page's <style>: it writes
  the colour variables and sets the theme before anything is painted, so a
  page never flashes in the wrong colours. Once the page is parsed it adds a
  Theme dropdown to the header (.header-actions, or .header-inner where a page
  has no actions group).

  What it sets on <html>
    data-palette   the theme id ("forest", "topik", "dark", …)
    data-theme     "light" or "dark" — what pages' own dark-only rules key on
    color-scheme   the same, for form controls and scrollbars

  Storage
    korean.siteTheme     the theme id
    koreanQuizThemeV2    "light"/"dark", still written so the pages under
                         archive/, which keep their own palettes, follow the
                         light/dark half of the choice

  The variable contract every page's CSS follows (korean-ui-design-system.md):
    --background / --foreground          the page and the text on it; also the
                                         text on the soft backgrounds below
    --muted, --muted-strong, --blue-soft,
    --secondary-soft, --accent-soft      soft backgrounds (inputs, pills, rule
                                         cards, feedback) under --foreground
    --surface, --surface-muted /
    --surface-text                       cards and tables, and their text
    --primary, --secondary, --accent     fills, each with its text colour:
    --on-primary, --on-secondary,
    --on-accent (and --on-fill = --on-primary)
    --inverse / --inverse-text           exercise headers
    --hero-heading, --hero-text,
    --hero-kicker                        the hero, and the small line above its title
    --inverse-kicker, --surface-kicker   small coloured labels on an exercise header
                                         and on a card (derived: the primary where it
                                         reads, else the text colour)
    --subtle, --border                   secondary text, rules
    --chip / --on-chip                   the white chip and its text
    --handwrite*, --speak*               the handwriting and speaking buttons

  API: window.SiteTheme = { THEMES, current(), set(id) }, and a
  "site-theme-change" event on window after every change.
*/
(function () {
  "use strict";

  const KEY = "korean.siteTheme";
  const LEGACY_KEY = "koreanQuizThemeV2";
  const DEFAULT_LIGHT = "forest";
  const DEFAULT_DARK = "dark";

  /* Each palette as the page it came from had it. A value a page never
     defined is filled in from the palette's own colours. */
  const THEMES = [
    {
      id: "forest", label: "Forest", from: "Home page", mode: "light",
      v: {
        background: "#214E34", foreground: "#FBF5F3",
        primary: "#5C7457", "primary-hover": "#4E6449",
        secondary: "#C1BCAC", "secondary-soft": "#4F6E58",
        accent: "#EFD0CA", "accent-soft": "#7C4C47",
        muted: "#EFD0CA", "muted-strong": "#C1BCAC", "blue-soft": "#5C7457",
        border: "#979B8D", subtle: "#C1BCAC",
        "on-primary": "#FFFFFF", "on-secondary": "#214E34", "on-accent": "#214E34", "on-muted": "#214E34",
        surface: "#FBF5F3", "surface-text": "#214E34", "surface-muted": "#F4E4E0",
        inverse: "#214E34", "inverse-text": "#EFD0CA",
        "hero-heading": "#FFFFFF", "hero-text": "#EFD0CA", chip: "#FFFFFF",
        handwrite: "#979B8D", "handwrite-hover": "#878B7E", "on-handwrite": "#10261A",
        speak: "#C1BCAC", "speak-hover": "#B0AB9B", "on-speak": "#214E34"
      }
    },
    {
      id: "topik", label: "TOPIK Navy", from: "TOPIK and reading pages", mode: "light",
      v: {
        background: "#28468A", foreground: "#F5F5F5",
        primary: "#BCE0E6", "primary-hover": "#ADC6CB",
        secondary: "#AD8FE6", "secondary-soft": "#705CAE",
        accent: "#C74E33", "accent-soft": "#A24B36",
        muted: "#A0E090", "muted-strong": "#99C588", "blue-soft": "#4C60C8",
        border: "#6674C8", subtle: "#DEEAAE",
        "on-primary": "#192B5D", "on-secondary": "#192B5D", "on-accent": "#FFFFFF", "on-muted": "#192B5D",
        surface: "#F5F5F5", "surface-text": "#28468A", "surface-muted": "#E8ECF4",
        inverse: "#20386E", "inverse-text": "#F5F5F5",
        "hero-heading": "#FFFFFF", "hero-text": "#EFF6FF", chip: "#FFFFFF", "on-chip": "#192B5D",
        handwrite: "#E3B448", "handwrite-hover": "#D2A43A", "on-handwrite": "#28468A",
        speak: "#8CC7B0", "speak-hover": "#79B59E", "on-speak": "#28468A"
      }
    },
    {
      id: "beige", label: "Beige", from: "Tue-Wed Korean", mode: "light",
      v: {
        background: "#EFE3D6", foreground: "#70593C",
        primary: "#8C6A47", "primary-hover": "#7B5F42",
        secondary: "#C6B29A", "secondary-soft": "#EFE7DC",
        accent: "#7B5F42", "accent-soft": "#ECE1D4",
        muted: "#E6D9C8", "muted-strong": "#D8C7B2", "blue-soft": "#F3EBE1",
        border: "#D4C2AC", subtle: "#E6D9C8",
        "on-primary": "#FFF8EE", "on-secondary": "#2B1F12", "on-accent": "#FFF8EE", "on-muted": "#70593C",
        surface: "#FBF7F2", "surface-text": "#70593C", "surface-muted": "#F3EBE1",
        inverse: "#70593C", "inverse-text": "#EFE3D6",
        "hero-heading": "#70593C", "hero-text": "#70593C", chip: "#FFFFFF",
        handwrite: "#76683F", "handwrite-hover": "#665A36", "on-handwrite": "#FFF8EE",
        speak: "#577166", "speak-hover": "#4A6157", "on-speak": "#FFF8EE"
      }
    },
    {
      id: "sand", label: "Sand & Fern", from: "공학 학술한국어", mode: "light",
      v: {
        background: "#F2E8CF", foreground: "#1B2A1E",
        primary: "#386641", "primary-hover": "#2B5033",
        secondary: "#A7C957", "secondary-soft": "#EEF3DA",
        accent: "#BC4749", "accent-soft": "#F4DEDC",
        muted: "#E9DFC4", "muted-strong": "#DCD0B0", "blue-soft": "#F7F1E1",
        border: "#D9CDAE", subtle: "#A7C957",
        "on-primary": "#FFFFFF", "on-secondary": "#1B2A1E", "on-accent": "#FFFFFF", "on-muted": "#1B2A1E",
        surface: "#FBF8EF", "surface-text": "#1B2A1E", "surface-muted": "#F3EDDC",
        inverse: "#1B2A1E", "inverse-text": "#F2E8CF",
        "hero-heading": "#1B2A1E", "hero-text": "#1B2A1E", chip: "#FFFFFF",
        handwrite: "#71A353", "handwrite-hover": "#639248", "on-handwrite": "#1B2A1E",
        speak: "#3D6E7A", "speak-hover": "#325C66", "on-speak": "#FFFFFF"
      }
    },
    {
      id: "ivory", label: "Ivory & Ember", from: "강태홍", mode: "light",
      v: {
        background: "#FFFCF2", foreground: "#252422",
        primary: "#EB5E28", "primary-hover": "#D14F1C",
        secondary: "#CCC5B9", "secondary-soft": "#EDE9E1",
        accent: "#403D39", "accent-soft": "#E6E1D8",
        muted: "#F3EFE4", "muted-strong": "#E2DCCF", "blue-soft": "#F7F3EA",
        border: "#D9D2C5", subtle: "#CCC5B9",
        "on-primary": "#252422", "on-secondary": "#252422", "on-accent": "#FFFCF2", "on-muted": "#252422",
        surface: "#FFFEFA", "surface-text": "#252422", "surface-muted": "#F6F2E8",
        inverse: "#252422", "inverse-text": "#FFFCF2",
        "hero-heading": "#252422", "hero-text": "#403D39", chip: "#FFFFFF",
        handwrite: "#6F685D", "handwrite-hover": "#5E5850", "on-handwrite": "#FFFCF2",
        speak: "#5C6B73", "speak-hover": "#4D5A61", "on-speak": "#FFFCF2"
      }
    },
    {
      id: "mint", label: "Mint & Plum", from: "문지현", mode: "light",
      v: {
        background: "#EFF9F0", foreground: "#13070C",
        primary: "#6B4D57", "primary-hover": "#5A3F48",
        secondary: "#DDC8C4", "secondary-soft": "#F2E8E6",
        accent: "#896A67", "accent-soft": "#EADCDA",
        muted: "#E3EEE4", "muted-strong": "#D3DDD4", "blue-soft": "#F6EFEE",
        border: "#D6C4C0", subtle: "#DDC8C4",
        "on-primary": "#FFFFFF", "on-secondary": "#13070C", "on-accent": "#FFFFFF", "on-muted": "#13070C",
        surface: "#FBFEFB", "surface-text": "#13070C", "surface-muted": "#F2F7F2",
        inverse: "#13070C", "inverse-text": "#EFF9F0",
        "hero-heading": "#13070C", "hero-text": "#13070C", chip: "#FFFFFF",
        handwrite: "#5E7D66", "handwrite-hover": "#4F6C57", "on-handwrite": "#FFFFFF",
        speak: "#5B6C8A", "speak-hover": "#4C5B75", "on-speak": "#FFFFFF"
      }
    },
    {
      id: "lemon", label: "Lemon", from: "HowToStudyKorean", mode: "light",
      v: {
        background: "#F6F8AA", foreground: "#1D7735",
        primary: "#D86546", "primary-hover": "#C4553A",
        secondary: "#7FB5D7", "secondary-soft": "#DCEBF5",
        accent: "#D86546", "accent-soft": "#FBEBE6",
        muted: "#EEF19C", "muted-strong": "#DDE187", "blue-soft": "#E6F1F8",
        border: "#C2D39A", subtle: "#D8EBB4",
        "on-primary": "#082611", "on-secondary": "#082611", "on-accent": "#082611", "on-muted": "#1D7735",
        surface: "#FFFFF4", "surface-text": "#1D7735", "surface-muted": "#F9FAD2",
        inverse: "#1D7735", "inverse-text": "#F6F8AA",
        "hero-heading": "#1D7735", "hero-text": "#1D7735", chip: "#FFFFFF",
        handwrite: "#1D7735", "handwrite-hover": "#17622B", "on-handwrite": "#FFFFF4",
        speak: "#2F5F8A", "speak-hover": "#264E72", "on-speak": "#FFFFF4"
      }
    },
    {
      id: "sky", label: "Sky", from: "Yonsei University Press", mode: "light",
      v: {
        background: "#EAF4FB", foreground: "#0B3A75",
        primary: "#2AA9E4", "primary-hover": "#1494D0",
        secondary: "#9DBFE4", "secondary-soft": "#DDEAF7",
        accent: "#EE8A5E", "accent-soft": "#FBE2D6",
        muted: "#D5E9F6", "muted-strong": "#BBD9EF", "blue-soft": "#E2EFF9",
        border: "#A8C9E5", subtle: "#C8E0F2",
        "on-primary": "#062246", "on-secondary": "#062246", "on-accent": "#062246", "on-muted": "#0B3A75",
        surface: "#FFFFFF", "surface-text": "#0B3A75", "surface-muted": "#F1F7FC",
        inverse: "#0B3A75", "inverse-text": "#EAF4FB",
        "hero-heading": "#0B3A75", "hero-text": "#0B3A75", chip: "#FFFFFF",
        handwrite: "#0B3A75", "handwrite-hover": "#082C5B", "on-handwrite": "#FFFFFF",
        speak: "#5B4E9C", "speak-hover": "#4A3F83", "on-speak": "#FFFFFF"
      }
    },
    {
      id: "dark", label: "Dark", from: "most pages' dark mode", mode: "dark",
      v: {
        background: "#0A0A0A", foreground: "#F5F5F5",
        primary: "#E5E5E5", "primary-hover": "#CFCFCF",
        secondary: "#A3A3A3", "secondary-soft": "#262626",
        accent: "#808080", "accent-soft": "#1C1C1C",
        muted: "#262626", "muted-strong": "#404040", "blue-soft": "#262626",
        border: "#3A3A3A", subtle: "#A3A3A3",
        "on-primary": "#0A0A0A", "on-secondary": "#0A0A0A", "on-accent": "#0A0A0A", "on-muted": "#F5F5F5",
        surface: "#171717", "surface-text": "#F5F5F5", "surface-muted": "#262626",
        inverse: "#000000", "inverse-text": "#F5F5F5",
        "hero-heading": "#FFFFFF", "hero-text": "#D4D4D4", chip: "#F5F5F5",
        handwrite: "#525252", "handwrite-hover": "#5E5E5E", "on-handwrite": "#F5F5F5",
        speak: "#3E4A55", "speak-hover": "#4A5763", "on-speak": "#F5F5F5"
      }
    },
    {
      id: "dark-navy", label: "Dark Navy", from: "TOPIK and reading pages' dark mode", mode: "dark",
      v: {
        background: "#111827", foreground: "#F9FAFB",
        primary: "#6CC2D0", "primary-hover": "#5BB3C2",
        secondary: "#7C4CD7", "secondary-soft": "#201933",
        accent: "#E29D8D", "accent-soft": "#391B13",
        muted: "#2C3A4E", "muted-strong": "#3B4A60", "blue-soft": "#12193B",
        border: "#374151", subtle: "#CBD5E1",
        "on-primary": "#111827", "on-secondary": "#F9FAFB", "on-accent": "#111827", "on-muted": "#F9FAFB",
        surface: "#1F2937", "surface-text": "#F9FAFB", "surface-muted": "#111827",
        inverse: "#0F172A", "inverse-text": "#F9FAFB",
        "hero-heading": "#FFFFFF", "hero-text": "#E5E7EB", chip: "#F9FAFB",
        handwrite: "#D4A93F", "handwrite-hover": "#C29834", "on-handwrite": "#111827",
        speak: "#6FAE97", "speak-hover": "#5F9D86", "on-speak": "#111827"
      }
    },
    {
      id: "dark-forest", label: "Dark Forest", from: "Home page's dark mode", mode: "dark",
      v: {
        background: "#0E2216", foreground: "#EFD0CA",
        primary: "#C1BCAC", "primary-hover": "#D0CCBF",
        secondary: "#979B8D", "secondary-soft": "#2A4535",
        accent: "#EFD0CA", "accent-soft": "#3A3230",
        muted: "#1F452A", "muted-strong": "#2E5A3C", "blue-soft": "#214E34",
        border: "#3A5A45", subtle: "#C1BCAC",
        "on-primary": "#10261A", "on-secondary": "#10261A", "on-accent": "#10261A", "on-muted": "#EFD0CA",
        surface: "#17331F", "surface-text": "#EFD0CA", "surface-muted": "#10261A",
        inverse: "#0A1A10", "inverse-text": "#EFD0CA",
        "hero-heading": "#FBF5F3", "hero-text": "#EFD0CA", chip: "#EFD0CA",
        handwrite: "#2A4535", "handwrite-hover": "#335240", "on-handwrite": "#EFD0CA",
        speak: "#3A5A45", "speak-hover": "#456A52", "on-speak": "#EFD0CA"
      }
    }
  ];
  const BY_ID = new Map(THEMES.map(theme => [theme.id, theme]));

  /* The palette names pages used to define themselves — --light-background
     and friends — are kept as aliases, so nothing that still reads one
     breaks. */
  const ALIASED = ["background", "foreground", "primary", "primary-hover", "secondary", "secondary-soft",
    "accent", "accent-soft", "muted", "muted-strong", "blue-soft", "border", "subtle"];

  /* WCAG contrast between two #RRGGBB colours. */
  function luminance(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [n >> 16, (n >> 8) & 255, n & 255]
      .map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); })
      .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
  }
  function contrast(a, b) {
    const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  }
  /* The primary where it reads against `bg`, else that background's text. A
     palette's primary was picked for its own page's backgrounds — TOPIK's
     pale cyan on navy, the beige page's brown on cream — and small coloured
     labels need it to stay legible on every page's backgrounds. */
  const readable = (v, bg, text) => (contrast(v.primary, v[bg]) >= 3 ? v.primary : v[text]);

  function rule(theme) {
    const v = Object.assign({}, theme.v);
    v["on-fill"] = v["on-fill"] || v["on-primary"];
    v["hero-kicker"] = v["hero-kicker"] || readable(v, "background", "hero-text");
    v["inverse-kicker"] = readable(v, "inverse", "inverse-text");
    v["surface-kicker"] = readable(v, "surface", "surface-text");
    v["on-chip"] = v["on-chip"] || (theme.mode === "dark" ? v.background : (v["surface-text"]));
    const lines = Object.keys(v).map(name => "--" + name + ":" + v[name] + ";");
    ALIASED.forEach(name => lines.push("--light-" + name + ":" + v[name] + ";"));
    return 'html[data-palette="' + theme.id + '"]{color-scheme:' + theme.mode + ";" + lines.join("") + "}";
  }

  /* The menu wears the header links' own look — the same height, padding,
     fill, radius, weight and hover — so it reads as one more of them, with
     only a small caret to say it opens. */
  const PICKER_CSS = ""
    + ".theme-picker{position:relative;display:inline-flex;align-items:center;flex:none;}"
    + ".theme-picker select{appearance:none;-webkit-appearance:none;box-sizing:border-box;width:auto;min-width:0;"
    + "height:auto;min-height:40px;margin:0;padding:0 28px 0 13px;color:var(--surface-text);background:var(--surface-muted);"
    + "border:1px solid transparent;border-radius:var(--radius-md,6px);box-shadow:none;"
    + "font-family:inherit;font-size:inherit;font-weight:700;line-height:normal;cursor:pointer;}"
    + ".theme-picker select:hover{border-color:var(--primary);background:var(--blue-soft);color:var(--foreground);}"
    + ".theme-picker select:focus{border-color:var(--primary);background:var(--surface-muted);color:var(--surface-text);}"
    + ".theme-picker select:focus-visible{outline:2px solid var(--primary);outline-offset:2px;}"
    + ".theme-picker select option,.theme-picker select optgroup{color:initial;background:initial;font-weight:400;}"
    + ".theme-picker::after{content:'';position:absolute;right:12px;top:50%;width:5px;height:5px;margin-top:-4px;"
    + "border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);"
    + "color:var(--surface-text);opacity:.7;pointer-events:none;}"
    + ".theme-picker-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}"
    + ".site-header .brand{flex:1 1 auto;min-width:0;}"
    + ".site-header .header-link{white-space:nowrap;}"
    + "@media (max-width:560px){.theme-picker select{max-width:8.5rem;}}"
    + "@media print{.theme-picker{display:none;}}";

  const style = document.createElement("style");
  style.id = "site-theme";
  style.textContent = THEMES.map(rule).join("\n") + "\n" + PICKER_CSS;
  (document.head || document.documentElement).appendChild(style);

  function read(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }
  function prefersDark() {
    try { return window.matchMedia("(prefers-color-scheme: dark)").matches; } catch (_) { return false; }
  }

  /* No choice yet: a reader who had the old toggle on dark stays dark; anyone
     else gets the home page's palette, or the dark one if the system asks. */
  function initial() {
    const saved = read(KEY);
    if (saved && BY_ID.has(saved)) return saved;
    const legacy = read(LEGACY_KEY);
    if (legacy === "dark") return DEFAULT_DARK;
    if (legacy === "light") return DEFAULT_LIGHT;
    return prefersDark() ? DEFAULT_DARK : DEFAULT_LIGHT;
  }

  let currentId = null;

  function apply(id) {
    const theme = BY_ID.get(id) || BY_ID.get(DEFAULT_LIGHT);
    currentId = theme.id;
    const root = document.documentElement;
    root.dataset.palette = theme.id;
    root.dataset.theme = theme.mode;
    root.style.colorScheme = theme.mode;
    document.querySelectorAll("select[data-site-theme]").forEach(select => { select.value = theme.id; });
    try { window.dispatchEvent(new CustomEvent("site-theme-change", { detail: { id: theme.id, mode: theme.mode } })); } catch (_) {}
  }

  function set(id) {
    if (!BY_ID.has(id)) return;
    try {
      localStorage.setItem(KEY, id);
      localStorage.setItem(LEGACY_KEY, BY_ID.get(id).mode);
    } catch (_) {}
    apply(id);
  }

  apply(initial());

  /* Another tab picked a theme: follow it. */
  window.addEventListener("storage", event => {
    if (event.key === KEY && event.newValue && BY_ID.has(event.newValue)) apply(event.newValue);
  });
  /* With nothing picked, follow the system's light/dark switch. */
  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (!read(KEY)) apply(initial());
    });
  } catch (_) {}

  function option(theme) {
    return '<option value="' + theme.id + '" title="From ' + theme.from.replace(/"/g, "&quot;") + '">'
      + theme.label + "</option>";
  }

  function mountPicker() {
    if (document.querySelector("select[data-site-theme]")) return;
    const host = document.querySelector(".site-header .header-actions")
      || document.querySelector(".site-header .header-inner")
      || document.querySelector(".header-actions");
    if (!host) return;
    const label = document.createElement("label");
    label.className = "theme-picker";
    label.innerHTML = '<span class="theme-picker-label">Theme</span>'
      + '<select data-site-theme aria-label="Colour theme" title="Colour theme">'
      + '<optgroup label="Light">' + THEMES.filter(t => t.mode === "light").map(option).join("") + "</optgroup>"
      + '<optgroup label="Dark">' + THEMES.filter(t => t.mode === "dark").map(option).join("") + "</optgroup>"
      + "</select>";
    host.appendChild(label);
    const select = label.querySelector("select");
    select.value = currentId;
    select.addEventListener("change", () => set(select.value));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountPicker);
  else mountPicker();

  window.SiteTheme = {
    THEMES: THEMES.map(theme => ({ id: theme.id, label: theme.label, from: theme.from, mode: theme.mode })),
    current: () => currentId,
    set
  };
}());

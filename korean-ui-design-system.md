# Interactive Quiz UI

*Design system and reproduction guide  ·  Version 1.0*


## Editable color variables

> **Edit colors here.** Every color reference elsewhere in this document points to one of these variables.

```css
:root {
  /* Light theme */
  --light-background: #28468A;
  --light-foreground: #F5F5F5;
  --light-primary: #BCE0E6;
  --light-primary-hover: #ADC6CB;
  --light-secondary: #AD8FE6;
  --light-secondary-soft: #8E7EBF;
  --light-accent: #C74E33;
  --light-accent-soft: #A24B36;
  --light-muted: #A0E090;
  --light-muted-strong: #99C588;
  --light-blue-soft: #6375CF;
  --light-border: #6674C8;
  --light-subtle: #DEEAAE;
}

html[data-theme='dark'] {
  --light-background: #111827;
  --light-foreground: #F9FAFB;
  --light-primary: #6CC2D0;
  --light-primary-hover: #6CC0D0;
  --light-secondary: #8B61DC;
  --light-secondary-soft: #201933;
  --light-accent: #E29D8D;
  --light-accent-soft: #391B13;
  --light-muted: #1F2937;
  --light-muted-strong: #374151;
  --light-blue-soft: #12193B;
  --light-border: #374151;
  --light-subtle: #CBD5E1;
}

  /* Fixed contrast colors */
  --hero-heading: #FFFFFF;
  --hero-text: #EFF6FF;
}
```

A task-first, flat interface for interactive quizzes. The system prioritizes clear hierarchy, restrained page chrome, immediate feedback, and stable behavior across desktop and mobile.

## 1. Color system

> **Palette rule.** Use semantic tokens rather than hard-coded component colors. The light palette is the default; dark mode replaces token values while preserving component meaning and hierarchy.

### Light theme — default

| Swatch | Role / token | Variable | Primary use |
| --- | --- | --- | --- |
| ■ | **Background**<br>`--background` | `var(--light-background)` | Main canvas, cards, header |
| ■ | **Foreground**<br>`--foreground` | `var(--light-foreground)` | Primary text, dark card headers |
| ■ | **Primary**<br>`--primary` | `var(--light-primary)` | Hero, primary actions, focus, numbering |
| ■ | **Primary hover**<br>`--primary-hover` | `var(--light-primary-hover)` | Primary button hover |
| ■ | **Secondary**<br>`--secondary` | `var(--light-secondary)` | Correct states, progress, selected section color |
| ■ | **Secondary soft**<br>`--secondary-soft` | `var(--light-secondary-soft)` | Correct feedback background |
| ■ | **Accent**<br>`--accent` | `var(--light-accent)` | Scores, warning states, alternating headers |
| ■ | **Accent soft**<br>`--accent-soft` | `var(--light-accent-soft)` | Incorrect/warning feedback background |
| ■ | **Muted**<br>`--muted` | `var(--light-muted)` | Inputs, navigation pills, alternate surfaces |
| ■ | **Muted strong**<br>`--muted-strong` | `var(--light-muted-strong)` | Disabled fields, progress tracks |
| ■ | **Blue soft**<br>`--blue-soft` | `var(--light-blue-soft)` | Rule cards, hover states, summaries |
| ■ | **Border**<br>`--border` | `var(--light-border)` | Hairlines and control borders |
| ■ | **Subtle text**<br>`--subtle` | `var(--light-subtle)` | Labels and secondary text |
| ■ | **Hero text**<br>`fixed` | `var(--hero-text)` | Body copy on primary blue |

> **Note:** Avoid pure black for text. `var(--light-foreground)` keeps the interface high-contrast without appearing harsh.

### Dark theme — token substitutions

| Swatch | Role / token | Variable | Primary use |
| --- | --- | --- | --- |
| ■ | **Background**<br>`--background` | `var(--dark-background)` | Main surfaces |
| ■ | **Foreground**<br>`--foreground` | `var(--dark-foreground)` | Primary text |
| ■ | **Primary**<br>`--primary` | `var(--dark-primary)` | Hero/action emphasis |
| ■ | **Primary hover**<br>`--primary-hover` | `var(--dark-primary-hover)` | Primary hover |
| ■ | **Secondary**<br>`--secondary` | `var(--dark-secondary)` | Correct states and progress |
| ■ | **Secondary soft**<br>`--secondary-soft` | `var(--dark-secondary-soft)` | Correct feedback background |
| ■ | **Accent**<br>`--accent` | `var(--dark-accent)` | Scores and warnings |
| ■ | **Accent soft**<br>`--accent-soft` | `var(--dark-accent-soft)` | Warning feedback background |
| ■ | **Muted**<br>`--muted` | `var(--dark-muted)` | Inputs and navigation pills |
| ■ | **Muted strong**<br>`--muted-strong` | `var(--dark-muted-strong)` | Disabled surfaces |
| ■ | **Blue soft**<br>`--blue-soft` | `var(--dark-blue-soft)` | Rule cards and hover |
| ■ | **Border**<br>`--border` | `var(--dark-border)` | Hairlines and outlines |
| ■ | **Subtle text**<br>`--subtle` | `var(--dark-subtle)` | Secondary text |
| ■ | **Deep surface**<br>`--mantle` | `var(--dark-mantle)` | Exercise headers / inverse panels |

> **Note:** The hero remains blue in both themes. Dark mode changes surfaces and text, not the semantic role of the colors.

## 2. Design principles

| Principle | Guidance |
| --- | --- |
| **Simplicity over decoration** | No geometric hero artwork, ornamental badges, oversized split layouts, or unnecessary feature chips. |
| **Task first** | The quiz content is the product. Page chrome should orient the learner and then get out of the way. |
| **Flat hierarchy** | Use solid fills, spacing, type scale, and simple borders. Do not rely on shadows or glass effects. |
| **Strong landmarks** | One blue banner, compact section navigation, colored section headers, and dark exercise headers create predictable wayfinding. |
| **Immediate state visibility** | Scores, progress, correct/incorrect feedback, disabled inputs, and timer states must be obvious without animation. |
| **Consistency across lessons** | Only titles, descriptions, section labels, and quiz logic change. The shell and component rules remain stable. |

## 3. Typography

> **Primary typeface.** Use Outfit for the web UI: 400, 500, 600, 700, and 800. Fallback to a clean sans-serif when Outfit is unavailable.

| **Style** | **Weight** | **Size** | **Line** | **Tracking** | **Usage** |
| --- | --- | --- | --- | --- | --- |
| **Page title / hero H1** | Outfit 800 | clamp(3rem, 7vw, 5.7rem) | 0.92 | -0.02em | Maximum 14 characters per line where practical |
| **Section H2** | Outfit 800 | clamp(2.2rem, 5vw, 4.8rem) | 1.0 | -0.02em | Strong colored section landmark |
| **Exercise H3** | Outfit 800 | clamp(1.45rem, 3vw, 2.3rem) | 1.0 | -0.02em | Inside inverse exercise header |
| **Question text** | Outfit 700 | clamp(1.25rem, 2.5vw, 2rem) | 1.2 | normal | Primary task content |
| **Body** | Outfit 400/500 | 1rem | 1.6 | normal | Explanations and descriptions |
| **Button / score label** | Outfit 700 | .78rem | 1.0 | .08em | Uppercase in quiz controls; sentence case in page chrome |
| **Kicker / metadata** | Outfit 700 | .72–.78rem | 1.0 | .12–.18em | Uppercase, short phrases only |
| **Navigation pill** | Outfit 600/700 | .88rem | 1.0 | normal | Keep labels concise and scannable |

## 4. Geometry, spacing, and motion

| **Token** | **Value** | **Rule** |
| --- | --- | --- |
| **Content width** | 1120px maximum | Desktop shell: min(1120px, calc(100% - 40px)). |
| **Desktop outer margin** | 20px minimum per side | Main shell uses 40px total viewport subtraction. |
| **Header height** | 64px | 60px on mobile. |
| **Hero padding** | clamp(48px, 7vw, 82px) | Mobile: 48px 22px. |
| **Section header padding** | clamp(30px, 5vw, 64px) | Increase vertical rhythm between major topics. |
| **Section content padding** | clamp(26px, 5vw, 64px) | Mobile left/right: approximately 22px. |
| **Component gap** | 8px / 10px / 20px / 28px | 8 for compact controls; 28 between exercise cards. |
| **Radius — medium** | 6px | Inputs, buttons, navigation pills. |
| **Radius — large** | 8px | Shell, cards, feedback blocks. |
| **Border** | 1px solid --border | Page chrome and lightweight divisions. |
| **Progress height** | 12px | Flat horizontal fill. |
| **Transition** | all 200ms ease | Disable under prefers-reduced-motion. |
| **Shadows** | None | Use contrast and spacing instead. |

## 5. Page anatomy

1. **Compact header** — Brand link on the left. Home and theme controls on the right. No logo block, design badge, or sticky behavior.

2. **Blue intro banner** — One full-width primary-blue block with lesson date/title and one concise description.

3. **Section navigator** — White strip with gray pill links. It wraps on desktop and scrolls horizontally on mobile.

4. **Section sequence** — Each major learning topic begins with a large colored header, then a neutral content area.

5. **Exercise cards** — Dark inverse header, score block, progress track, question stage, controls, and feedback.

6. **Source note** — Small muted statement at the end of the learning content.

7. **Back-to-top control** — Fixed 46px circular control at bottom-right with an upward arrow. Contrasting colors for control background and arrow.

8. **Light/Dark theme control** — Fixed 46px circular control at bottom-right next to back-to-top control with a sun/moon icon for light/dark mode. Contrasting colors for control background and icon.

## 6. Component specifications

### 6.1 Header

| Attribute | Specification |
| --- | --- |
| **Structure** | 64px high, white/default surface, 1px bottom border, non-sticky. |
| **Brand** | One text link, 1rem/800, -0.02em tracking. Recommended label: “Mitch – English Tutoring Resources.” |
| **Actions** | Home link and theme toggle; 40px minimum height; 13px horizontal padding; 6px radius. |
| **Mobile** | 60px high. Keep brand on one line with ellipsis; hide the theme text label and retain the icon. |

### 6.2 Hero / lesson banner

| Attribute | Specification |
| --- | --- |
| **Surface** | Solid --primary blue. No artwork, pseudo-elements, split columns, badges, or chips. |
| **Content** | Lesson date plus subject in H1, followed by a single line or short paragraph describing the practice. |
| **Padding** | 48–82px responsive padding. Mobile: 48px 22px. |
| **Text** | White H1; body text uses `var(--hero-text)`; body maximum width 62ch. |

### 6.3 Section navigation

| Attribute | Specification |
| --- | --- |
| **Container** | White/default surface, 18px 22px padding, 1px bottom border. |
| **Label** | “Jump to a section” in .72rem uppercase with .12em tracking. |
| **Links** | 40px minimum height, 8px 12px padding, muted fill, 6px radius. |
| **Hover** | Blue-soft background plus primary border; no translation or scaling. |
| **Mobile** | Single horizontal row with overflow-x:auto; links never wrap internally. |

### 6.4 Section header

| Attribute | Specification |
| --- | --- |
| **Purpose** | Major visual landmark between sections. |
| **Layout** | Title group left; collapse button right. Minimum height 150px. |
| **Color cycle** | Secondary green, accent amber, and primary blue may rotate by section. Ensure dark text on green/amber and white text on blue. |
| **Collapse** | White button with 4px current-color border; 56px minimum height. Mobile: full width below the title. |

### 6.5 Explanation / rule card

| Attribute | Specification |
| --- | --- |
| **Surface** | Blue-soft background with 8px radius and 22–32px padding. |
| **Label** | Optional small “RULE” capsule in primary blue. |
| **Copy** | Use bold only for the grammar term or rule; include one or two examples in italics. |

### 6.6 Exercise card

| Attribute | Specification |
| --- | --- |
| **Header** | Foreground/dark inverse surface with white title and subdued description. |
| **Score** | Accent block aligned to the right; minimum width 158px; full width below header on mobile. |
| **Progress** | 12px track, secondary fill, no rounded capsule treatment. |
| **Stage** | 24–38px responsive padding; question number in primary blue; question text 700 weight. |
| **Card surface** | White/default surface with 8px radius; no shadow. |

### 6.7 Inputs and choices

| Attribute | Specification |
| --- | --- |
| **Text input** | 56px minimum height, muted fill, transparent 2px border, 6px radius. |
| **Textarea** | 160px minimum height; vertical resize allowed. |
| **Focus** | Default surface plus 2px primary border. Also preserve a visible focus outline. |
| **Disabled** | Muted-strong fill, subdued text, not-allowed cursor, full opacity. |
| **Option button** | 58px minimum height, left aligned, muted fill. Hover: primary blue with white text. |
| **Answer states** | Correct uses secondary; incorrect uses accent in July 22/24 or danger red where a dedicated error token exists. |

### 6.8 Buttons

| Attribute | Specification |
| --- | --- |
| **Primary** | White text on primary blue. |
| **Positive / next** | Dark text on secondary green. |
| **Warning / alternate set** | Dark text on accent amber. |
| **Secondary** | Foreground text on muted surface. |
| **Sizing** | 56px minimum height in quiz cards; compact 40px size only in page header. |
| **Motion** | A subtle scale up to 1.05 is allowed inside quiz cards. Page-chrome buttons do not scale. |

### 6.9 Feedback and review

| Attribute | Specification |
| --- | --- |
| **Correct** | Secondary-soft fill plus 8px secondary left border. |
| **Incorrect** | Accent-soft fill plus 8px accent left border. |
| **Neutral** | Muted fill plus 8px primary left border. |
| **Copy order** | Outcome → correct/model answer → explanation → optional upgrade. |
| **Review** | After completion, expose previous/next controls and retain the original response. |

### 6.10 Timer

| Attribute | Specification |
| --- | --- |
| **Desktop** | Question area plus a 220px timer column. |
| **Default** | Primary-blue timer surface with large white numerals. |
| **Warning** | Accent surface with dark text. |
| **Mobile** | Stack timer below the question stage; minimum timer height 150px. |

## 7. Interaction and state rules

| **State** | **Required behavior** |
| --- | --- |
| **Default** | All controls enabled only when actionable. The current question and score are visible. |
| **Hover** | Use a fill/border change. Avoid decorative movement in the header and section navigator. |
| **Focus visible** | 2–3px primary outline with 3px offset; do not remove browser focus without replacement. |
| **Selected** | Primary-blue fill with white text for a chosen option before submission. |
| **Correct** | Lock answer controls, show correct state, answer, and explanation. |
| **Incorrect** | Lock answer controls, show incorrect state and model answer immediately. |
| **Disabled** | Keep text readable; never reduce opacity so far that the answer becomes illegible. |
| **Complete** | Show final score, 100% progress, targeted practice notes, and navigable answer history. |
| **Collapsed** | Hide only section content; keep the section header and an explicit Expand control. |
| **Reduced motion** | Remove transitions and transforms when prefers-reduced-motion: reduce is active. |

## 8. Responsive behavior

- **Above 900px:** Two-column timer layouts are allowed. The page shell is centered at a maximum width of 1120px.
- **681–900px:** Hero remains single block. Timer areas stack when space becomes constrained.
- **680px and below:** Page shell becomes full-width with square outer corners; header remains one row; section links scroll horizontally; section headers and exercise headers stack; action buttons become full width.
- **Mobile type:** H1 uses clamp(2.8rem, 14vw, 4.5rem). Preserve large hierarchy but prevent overflow.
- **Mobile spacing:** Use 22px horizontal padding for the hero and section navigator; 16–22px inside dense quiz content.
- **Touch targets:** 38px minimum in the compact header; 54–58px for quiz controls and answer options.

## 9. Dark mode and accessibility

### Dark mode

- Persist the user choice in localStorage. Use the system preference only when no saved preference exists.
- Change semantic token values rather than maintaining a second set of component-specific declarations.
- Keep inverse exercise headers near `var(--dark-mantle)` or `var(--dark-mantle-deep)`, distinct from the main background.
- Keep score and warning blocks readable with dark text on yellow/green.
- Update the toggle label and aria-pressed state when the theme changes.

### Accessibility requirements

- Use semantic header, main, nav, section, article, button, label, and progress structures.
- Every input requires a visible label or an sr-only label connected with for/id.
- Use aria-live for feedback and timers that update during interaction.
- Use aria-expanded on collapse controls and keep button text synchronized with the state.
- Do not communicate correct/incorrect state by color alone; include icons or explicit text.
- Maintain keyboard operation: Enter checks or advances typed questions; all controls remain reachable with Tab.
- Respect reduced motion and preserve clear focus indicators.
- Persist page location/anchor in localStorage. If no anchor exists, load the page to the very top.

## 10. Content and naming rules

| Rule | Specification |
| --- | --- |
| **Lesson title** | Use “Month Day · Topic(s)” for the banner, e.g., “July 22 · Grammar / IELTS.” |
| **Banner description** | One sentence or compact comma-separated list. Do not restate feature counts. |
| **Section kicker** | Use short functional categories. |
| **Exercise title** | Use “Exercise 1: Action or concept.” Keep numbering local to the section. |
| **Instructions** | State exactly what to enter or choose. Mention comma separation or full-sentence requirements. |
| **Feedback** | Use direct language: Correct, Incorrect, Model answer, Why, Focus. |
| **Navigation** | Prefer short noun phrases. Preserve the same order as the sections below. |
| **Brand** | Use a short, overarching topic like English Tutoring Resources or Korean Language Resources. |

## 11. CSS token starter

```css
:root {
  color-scheme: light;
  --background: var(--light-background);
  --foreground: var(--light-foreground);
  --primary: var(--light-primary);
  --primary-hover: var(--light-primary-hover);
  --secondary: var(--light-secondary);
  --secondary-soft: var(--light-secondary-soft);
  --accent: var(--light-accent);
  --accent-soft: var(--light-accent-soft);
  --muted: var(--light-muted);
  --muted-strong: var(--light-muted-strong);
  --blue-soft: var(--light-blue-soft);
  --border: var(--light-border);
  --subtle: var(--light-subtle);
  --radius-md: 6px;
  --radius-lg: 8px;
  --font: 'Outfit', sans-serif;
  --transition: all 200ms ease;
}

html[data-theme='dark'] {
  color-scheme: dark;
  --background: var(--dark-background);
  --foreground: var(--dark-foreground);
  --primary: var(--dark-primary);
  --primary-hover: var(--dark-primary-hover);
  --secondary: var(--dark-secondary);
  --secondary-soft: var(--dark-secondary-soft);
  --accent: var(--dark-accent);
  --accent-soft: var(--dark-accent-soft);
  --muted: var(--dark-muted);
  --muted-strong: var(--dark-muted-strong);
  --blue-soft: var(--dark-blue-soft);
  --border: var(--dark-border);
  --subtle: var(--dark-subtle);
}
```

## 12. Base page-shell CSS

```css
.header-inner,
main {
  width: min(1120px, calc(100% - 40px));
  margin-inline: auto;
}

.site-header {
  background: var(--background);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

main {
  margin-top: 24px;
  margin-bottom: 64px;
  overflow: hidden;
  background: var(--background);
  border-radius: var(--radius-lg);
}

.hero {
  color: var(--hero-heading);
  background: var(--primary);
}

.hero-card {
  padding: clamp(48px, 7vw, 82px);
}

.toc-card {
  padding: 18px 22px;
  background: var(--background);
  border-bottom: 1px solid var(--border);
}
```

## 13. Reproduction checklist

- [ ] Colors use the semantic tokens in Section 1.
- [ ] Outfit is loaded at weights 400–800.
- [ ] Header is compact, non-sticky, and has only brand, Home, and theme controls.
- [ ] Hero is a single solid-blue block with no decoration.
- [ ] Section navigation is a lightweight strip with pill links.
- [ ] Desktop content is capped at 1120px.
- [ ] Section headers remain the primary wayfinding landmarks.
- [ ] Exercise cards preserve score, progress, question, controls, feedback, and review order.
- [ ] No box shadows are introduced.
- [ ] Mobile layout stacks section and exercise controls and makes navigation horizontally scrollable.
- [ ] Dark mode swaps tokens and persists the user choice.
- [ ] Keyboard, focus, aria-live, labels, collapse state, and reduced motion are verified.
- [ ] Quiz data and interaction logic are not coupled to visual style changes.

> **System boundary.** This document standardizes the visual shell and shared components. Question banks, scoring algorithms, timers, exercise types, and dynamic content generation remain lesson-specific implementation concerns.

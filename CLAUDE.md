# CLAUDE.md — Ian Ngure Portfolio

> Engineering standards, architecture rules, and workflow guidelines for this codebase.
> All contributors (human and AI) must follow these rules without exception.

---

## Project Identity

- **Name:** Ian Ngure — Full-Stack JavaScript Developer
- **Tagline:** Transforming ideas to digital products
- **Purpose:** Production-ready personal portfolio targeting hiring managers, recruiters, and remote employers

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, TypeScript, Vite              |
| Styling    | Tailwind CSS v3 (custom design tokens)  |
| Animation  | Framer Motion                           |
| Routing    | React Router v6                         |
| Server state | TanStack Query (React Query v5)       |
| Backend    | Node.js, Express.js (TypeScript)        |
| Database   | PostgreSQL via Neon Serverless          |
| Email      | Resend (contact form)                   |
| Deployment | Render    |



## Folder Structure Rules

```
frontend/src/
├── assets/          Static files only (images, icons). No logic.
├── components/
│   ├── ui/          Primitive, stateless, reusable UI components (Button, Badge, Card)
│   ├── layout/      Structural components (Navbar, Footer, Section, PageWrapper)
│   └── common/      App-wide interactive components (ThemeToggle, CommandPalette)
├── sections/        Full-page sections assembled from components. One folder per section.
├── pages/           Route-level page components. Thin — compose sections, no logic.
├── hooks/           Custom React hooks only. Each hook in its own file.
├── lib/             Pure utilities, API clients, helpers. No React imports.
├── data/            All static content (projects, skills, experience). No JSX.
├── styles/          globals.css only. No component-level CSS files.
├── types/           TypeScript interfaces and types. No runtime logic.
├── context/         React context providers only.
└── animations/      Framer Motion variant definitions only.
```

**Rules:**
- Never put business logic in `pages/` — delegate to sections or hooks
- Never put content strings directly in components — all content from `src/data/`
- Never create a `utils/` catch-all — put helpers in `lib/` with a descriptive filename

---

## Naming Conventions

| Type                   | Convention       | Example                      |
|------------------------|------------------|------------------------------|
| React components       | PascalCase       | `HeroSection.tsx`            |
| Hooks                  | camelCase + use  | `useScrollReveal.ts`         |
| Utilities / lib files  | camelCase        | `githubClient.ts`            |
| Types / interfaces     | PascalCase       | `Project`, `BlogPost`        |
| Constants              | SCREAMING_SNAKE  | `MAX_PROJECTS`               |
| CSS classes            | Tailwind only    | No custom class names        |
| Route paths            | kebab-case       | `/projects/my-project-slug`  |
| Data files             | camelCase        | `projects.ts`, `skills.ts`   |

---

## TypeScript Standards

- **No `any` types.** Use `unknown` + type narrowing if type is truly unknown.
- Every component must have a named `Props` interface (even if empty).
- Prefer `type` over `interface` for union types; prefer `interface` for object shapes.
- All API response shapes must be typed in `src/types/`.
- No implicit `any` — `"strict": true` in tsconfig.
- Use `satisfies` operator for config objects to get both inference and validation.

```ts
// Good
interface HeroProps {
  headline: string;
  subline?: string;
}

// Bad
const Hero = (props: any) => { ... }
```

---

## Component Rules

1. **Single responsibility.** One component does one thing.
2. **Props interface required.** Every component defines and exports its Props type.
3. **No inline styles.** Tailwind classes only. Exception: dynamic values passed to Framer Motion.
4. **No hardcoded content.** All text, links, and data from `src/data/`.
5. **Composition over configuration.** Prefer small composable components over large prop-driven ones.
6. **Max 150 lines per component file.** If longer, split into subcomponents.
7. **Export default at bottom** of every component file — not at the declaration.

```tsx
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'ghost';
}

const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button onClick={onClick} className={variants[variant]}>
      {label}
    </button>
  );
};

export default Button;
```

---

## Import Order

Enforced by ESLint `import/order`. Order must be:

1. React and React-related (`react`, `react-dom`, `react-router-dom`)
2. Third-party libraries (`framer-motion`, `@tanstack/react-query`)
3. Internal absolute imports (`@/components/...`, `@/hooks/...`)
4. Relative imports (`./HeroSection`, `../ui/Button`)
5. Type imports (`import type { ... }`)

Use `@/` alias for all internal imports (configured in `tsconfig.json` and `vite.config.ts`).

---

## Animation Rules

- **Never write inline `animate` objects in JSX.** All variants must come from `src/animations/variants.ts`.
- All animated components must wrap with `motion.*` from Framer Motion.
- Always pass `initial`, `animate`, and `exit` from named variants — not ad-hoc objects.
- All scroll-triggered animations use `whileInView` with `viewport={{ once: true }}`.
- Stagger lists using `staggerChildren` on the parent variant.
- Always respect reduced motion:

```tsx
import { useReducedMotion } from 'framer-motion';

const prefersReduced = useReducedMotion();
const variant = prefersReduced ? 'none' : 'fadeUp';
```

**Standard variants (from `src/animations/variants.ts`):**

| Name              | Use case                          |
|-------------------|-----------------------------------|
| `fadeUp`          | Section entry, cards, headings    |
| `fadeIn`          | Page transitions, overlays        |
| `staggerChildren` | Lists, skill grids, project cards |
| `slideInLeft`     | Timeline items, sidebar           |
| `scaleIn`         | Modals, tooltips, badges          |

---

## Responsive Design Standards

**Mobile-first.** Write base styles for mobile, override at `md:` and `lg:`.

| Breakpoint | Width     | Layout strategy                    |
|------------|-----------|------------------------------------|
| Default    | < 640px   | Single column, full-width, 16px padding |
| `sm:`      | ≥ 640px   | Still single column, slightly more space |
| `md:`      | ≥ 768px   | 2-column grids, condensed nav      |
| `lg:`      | ≥ 1024px  | Full layout, 3-column grids        |
| `xl:`      | ≥ 1280px  | Max content width capped at 1200px |

**Rules:**
- Never hardcode pixel widths — use Tailwind's responsive scale.
- All touch targets must be ≥ 44×44px.
- Test every section at 375px (iPhone SE), 768px (iPad), 1440px (Desktop).
- Navigation collapses to hamburger at `md:` and below.

---

## Accessibility (A11y) Standards

- Every page has exactly one `<h1>`.
- Interactive elements (`button`, `a`) must have accessible labels (`aria-label` if no visible text).
- All images require `alt` text. Decorative images use `alt=""`.
- Color contrast minimum: 4.5:1 for body text, 3:1 for large text (WCAG AA).
- All modals trap focus and return focus on close.
- Keyboard navigation must work for: Navbar, Contact form, Project filters, Theme toggle.
- Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- Never remove focus outlines — style them instead.

---

## SEO Standards

- Use `react-helmet-async` for all meta tags.
- Every page must have: `<title>`, `<meta name="description">`, OG tags, canonical URL.
- Home page uses `Person` JSON-LD schema.
- Project detail pages use `SoftwareApplication` JSON-LD schema.
- All routes must be crawlable (no auth walls on public pages).
- Images must have descriptive `alt` text for indexing.

```tsx
// Every page component must include:
<Helmet>
  <title>Ian Ngure — Full-Stack JavaScript Developer</title>
  <meta name="description" content="Transforming ideas to digital products..." />
  <meta property="og:title" content="Ian Ngure" />
  <meta property="og:image" content="/og-image.png" />
</Helmet>
```

---

## Performance Rules

| Metric                | Target     |
|-----------------------|------------|
| Lighthouse Performance | ≥ 90      |
| Lighthouse A11y        | 100       |
| Lighthouse SEO         | 100       |
| First Contentful Paint | < 1.5s    |
| Largest Contentful Paint | < 2.5s  |
| Initial JS bundle (gzip) | < 150KB |

**Rules:**
- All images must be WebP format with explicit `width` and `height`.
- Use `loading="lazy"` on all below-fold images.
- Code-split at the route level using `React.lazy` + `Suspense`.
- No unused dependencies — audit with `npx depcheck` before shipping.
- Fonts must be self-hosted or loaded via `fontsource` (no Google Fonts CDN).

---

## Code Quality Rules

- **No `console.log` in committed code.** Use a logger or remove before commit.
- **No commented-out code.** Delete it. Git history preserves it.
- **No TODO comments** unless they reference a tracked issue: `// TODO(#42): ...`
- **No magic numbers.** Name your constants.
- DRY but not premature — three identical lines warrant extraction; one does not.
- Prefer early returns over nested conditionals.

```ts
// Bad
function getLabel(type: string) {
  if (type === 'full-time') {
    return 'Full-time';
  } else {
    if (type === 'contract') {
      return 'Contract';
    }
  }
}

// Good
function getLabel(type: string) {
  if (type === 'full-time') return 'Full-time';
  if (type === 'contract') return 'Contract';
  return 'Other';
}
```

---

## Git Workflow

**Branch naming:**
```
feat/hero-section
feat/dark-mode
fix/contact-form-validation
chore/update-dependencies
refactor/skills-component
```

**Commit message format (Conventional Commits):**
```
feat(hero): add animated typewriter role text
fix(contact): correct email validation regex
chore(deps): update framer-motion to 11.x
refactor(skills): extract SkillBar into ui/
style(navbar): fix mobile menu z-index
```

**Rules:**
- One feature per branch.
- Never commit directly to `main`.
- PRs must pass Lighthouse CI before merge (when configured).
- Squash merge to keep `main` history clean.

---

## Content Data Contract

Every project entry in `src/data/projects.ts` must match:

```ts
interface Project {
  slug: string;           // kebab-case, used in URL
  title: string;
  tagline: string;        // one sentence
  description: string;   // 2-3 sentences
  tags: string[];         // tech tags
  liveUrl?: string;
  githubUrl?: string;
  image: string;          // path relative to /public
  featured: boolean;
  year: number;
  caseStudy?: {
    problem: string;
    solution: string;
    impact: string;
  };
}
```

---

## Environment Variables

**Frontend (`.env`):**
```
VITE_API_URL=
VITE_GITHUB_USERNAME=
```

**Backend (`.env`):**
```
DATABASE_URL=
RESEND_API_KEY=
GITHUB_TOKEN=
PORT=3001
NODE_ENV=development
```

- Never commit `.env` files.
- Always update `.env.example` when adding a new variable.

---

## Testing Standards

- Unit test all `lib/` utility functions with Vitest.
- Component tests for interactive components (forms, toggles) with Testing Library.
- No tests for static/presentational components — Storybook covers those.
- E2E: contact form submission, navigation, theme toggle (Playwright, Phase 7+).

---
 
  ## For Projects Secction use these live Links.
 
Children welfare and Compassion App:
https://give-and-receive.onrender.com/

Retailer POS APP:
https://stride-analytics-custom.onrender.com/

Developer Mini Porfolio:
https://tailwind-trial-tailwindcss.onrender.com/

Static web: Mawega Juice Company.
sensational-gumption-9002d5.netlify.app

   ## my Real Github
   https://github.com/ianngure254
   
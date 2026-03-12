# GAMI Health Protocol - Technical Specification

## Component Inventory

### shadcn/ui Components (Built-in)
- Button
- Card
- Input
- Dialog
- Tabs
- Badge
- Avatar
- Progress
- Select
- Dropdown Menu
- Sheet (mobile nav)
- Separator
- Scroll Area
- Tooltip
- Switch
- Radio Group
- Form
- Label
- Textarea

### Third-Party Components
- None required - custom implementations preferred

### Custom Components to Build

1. **Animated3DCard** - Hero section rotating card with logo
2. **HexagonGrid** - Background pattern overlay
3. **FloatingBadge** - Animated floating XP/token badges
4. **MetricsDashboard** - L2 metrics display with animated bars
5. **EcosystemCard** - Hover-animated feature cards
6. **LoginCard** - Toggle between User/Admin login
7. **FamilyMemberCard** - Household member display
8. **Timeline** - Checkup history timeline
9. **CircularProgress** - Rewards progress indicator
10. **AchievementBadge** - Locked/unlocked badge cards
11. **BenefitsTable** - Eligibility table with progress
12. **ChatWidget** - Floating chat assistant
13. **LanguageSwitcher** - Multi-language dropdown
14. **OutbreakIndicator** - Risk level bars
15. **AppointmentList** - Upcoming appointments

---

## Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Hero 3D Card Rotation | CSS + Framer Motion | rotateY animation, 20s linear infinite | Medium |
| Floating Badges | CSS Keyframes | translateY oscillation, 3s ease-in-out | Low |
| Page Load Stagger | Framer Motion | staggerChildren: 0.1, fade + translateY | Medium |
| Scroll Reveal | Framer Motion | whileInView, viewport once | Low |
| Card Hover Lift | CSS Transitions | translateY(-4px), shadow increase | Low |
| Progress Bar Fill | Framer Motion | animate width on inView | Medium |
| Number Count Up | Custom Hook | useCountUp with requestAnimationFrame | Medium |
| Corner Accent Line | CSS | ::after pseudo-element, width animation | Low |
| Tab Toggle Slide | Framer Motion | layoutId for shared element | Medium |
| Modal Open/Close | Framer Motion | AnimatePresence, scale + opacity | Medium |
| Chat Widget Toggle | Framer Motion | height + opacity animation | Low |
| Circular Progress | SVG + CSS | stroke-dasharray animation | Medium |
| Badge Flip | CSS 3D Transform | rotateY on hover | Low |
| Pulse Glow | CSS Keyframes | box-shadow oscillation | Low |
| Language Switch | Framer Motion | AnimatePresence for text swap | Low |

---

## Animation Library Choices

### Primary: Framer Motion
- React-native integration
- Declarative API
- AnimatePresence for mount/unmount
- whileInView for scroll triggers
- layout animations

### Secondary: CSS Animations/Transitions
- Simple hover effects
- Continuous animations (rotation, floating)
- Performance-critical animations

### Utilities
- Custom hooks for scroll detection
- Intersection Observer API

---

## Project File Structure

```
/mnt/okcomputer/output/app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── Animated3DCard.tsx
│   │   ├── HexagonGrid.tsx
│   │   ├── FloatingBadge.tsx
│   │   ├── MetricsDashboard.tsx
│   │   ├── EcosystemCard.tsx
│   │   ├── LoginCard.tsx
│   │   ├── FamilyMemberCard.tsx
│   │   ├── Timeline.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── AchievementBadge.tsx
│   │   ├── BenefitsTable.tsx
│   │   ├── ChatWidget.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── OutbreakIndicator.tsx
│   │   └── AppointmentList.tsx
│   ├── sections/
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── Ecosystem.tsx
│   │   ├── Layer2Metrics.tsx
│   │   ├── CTA.tsx
│   │   ├── Footer.tsx
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── RewardsPage.tsx
│   │   └── AdminPage.tsx
│   ├── hooks/
│   │   ├── useCountUp.ts
│   │   ├── useInView.ts
│   │   └── useLanguage.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── translations.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── images/
├── components.json
├── tailwind.config.js
└── package.json
```

---

## Dependencies to Install

### Core (Auto-installed)
- react
- react-dom
- typescript
- vite
- tailwindcss
- @radix-ui/*

### Animation
- framer-motion

### Icons
- lucide-react

### Fonts
- @fontsource/inter (or Google Fonts CDN)

### Utilities
- clsx
- tailwind-merge

---

## Color Configuration (Tailwind)

```javascript
// tailwind.config.js extend colors
colors: {
  'gami': {
    'purple': '#7c3aed',
    'purple-dark': '#6d28d9',
    'purple-light': '#a78bfa',
  },
  'bg': {
    'primary': '#0a0a0f',
    'secondary': '#111118',
    'tertiary': '#1a1a24',
  },
  'lime': {
    'accent': '#d4f932',
  }
}
```

---

## Key Implementation Notes

1. **3D Card**: Use CSS transform-style: preserve-3d with rotateY animation
2. **Hexagon Grid**: SVG pattern or CSS background-image
3. **Scroll Animations**: Use Framer Motion's whileInView with viewport: { once: true }
4. **Language Switching**: Store current language in state, use translation object
5. **Responsive**: Mobile-first approach, test all breakpoints
6. **Performance**: Lazy load pages, optimize images, use will-change sparingly

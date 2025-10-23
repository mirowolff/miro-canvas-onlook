# Miro Canvas Onlook - AI Development Guidelines

**Project Type**: Onlook-enabled Next.js canvas application
**Design System**: Miro Design System
**Philosophy**: Visual-first development with design token consistency

---

## Core Principles

1. **Small, correct changes** - Make targeted edits that respect existing architecture
2. **Design system first** - Always prefer Miro components over custom implementations
3. **Single-file maintainability** - Keep component logic and styles together
4. **Token-driven styling** - Use Miro design tokens exclusively for visual properties

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: 19.0.0
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS 4 + styled-jsx + Miro Design System
- **Package Manager**: Bun (preferred)
- **Visual Editor**: Onlook
- **Icons**: @mirohq/design-system-icons

---

## Styling Architecture

### Priority Order (CRITICAL):

1. **Miro Design System Components (First Choice)**
   ```tsx
   import { Button, Box, Flex } from '@mirohq/design-system';

   export function Example() {
     return (
       <Box>
         <Button>Click me</Button>
       </Box>
     );
   }
   ```

2. **Custom Components: styled-jsx + Miro CSS Variables**
   ```tsx
   export function CustomCard({ children }) {
     return (
       <>
         <div className="custom-card">
           {children}
         </div>

         <style jsx>{`
           .custom-card {
             background: var(--colors-blue-500);
             border-radius: var(--radii-100);
             padding: var(--space-200);
             border: 1px solid var(--colors-gray-300);
           }

           .custom-card:hover {
             background: var(--colors-blue-600);
           }
         `}</style>
       </>
     );
   }
   ```

3. **Tailwind Utilities (Only for quick layout/spacing)**
   ```tsx
   <div className="flex items-center gap-4">
     {/* Use Tailwind for layout, not theming */}
   </div>
   ```

### Miro Design Tokens Reference

All Miro CSS variables are available (see `miro-design-tokens.md` for complete list):

#### Semantic Tokens (Preferred - Theme-aware)

These tokens automatically adapt to light/dark themes and have semantic meaning:

**Text Colors:**
```css
var(--colors-text-neutrals)              /* Primary text color */
var(--colors-text-neutrals-subtle)       /* Secondary/muted text */
var(--colors-text-neutrals-disabled)     /* Disabled text */
var(--colors-text-neutrals-inverted)     /* Light text on dark bg */
var(--colors-text-primary)               /* Primary brand text */
var(--colors-text-danger)                /* Error/danger text */
var(--colors-text-success)               /* Success text */
```

**Background Colors:**
```css
var(--colors-background-neutrals)        /* Default surface color */
var(--colors-background-neutrals-layout) /* Page background */
var(--colors-background-neutrals-subtle) /* Subtle background */
var(--colors-background-neutrals-hover)  /* Hover state */
var(--colors-background-primary-prominent)  /* Primary buttons */
var(--colors-background-primary-subtle)     /* Primary backgrounds */
var(--colors-background-danger-prominent)   /* Error states */
```

**Border Colors:**
```css
var(--colors-border-neutrals)            /* Default borders */
var(--colors-border-neutrals-subtle)     /* Subtle borders */
var(--colors-border-primary)             /* Primary borders */
var(--colors-border-focus-outer)         /* Focus ring outer */
```

#### Base Color Tokens (Direct Colors)
```css
var(--colors-blue-500)      /* Primary blue */
var(--colors-gray-100)      /* Light gray */
var(--colors-coal-600)      /* Neutral gray */
var(--colors-alpha-black-200) /* Transparent black */
```

#### Spacing
```css
var(--space-0)      /* 0px */
var(--space-50)     /* 4px */
var(--space-100)    /* 8px */
var(--space-200)    /* 16px */
var(--space-400)    /* 32px */
```

#### Border Radius
```css
var(--radii-0)      /* 0px */
var(--radii-50)     /* 4px */
var(--radii-100)    /* 8px */
var(--radii-round)  /* 999px - fully rounded */
```

#### Typography
```css
var(--fonts-body)           /* Noto Sans, OpenSans, ... */
var(--fonts-heading)        /* Roobert PRO, ... */
var(--font-size-200)        /* 16px */
var(--font-weights-semibold) /* 600 */
var(--line-height-400)      /* 1.4 */
```

#### Other
```css
var(--border-widths-sm)     /* 1px */
var(--sizes-10)             /* 40px */
var(--z-indices-tooltip)    /* 400 */
```

---

## Critical Rules

### ✅ DO:
- Use Miro Design System components when available
- Use styled-jsx for custom component styling (keeps everything in one file)
- Reference Miro CSS variables for ALL visual properties (colors, spacing, etc.)
- Default to Server Components (use `use client` only when needed)
- Keep changes small and focused
- Use TypeScript strictly

### ❌ DO NOT:
- Use inline `style={}` props (use styled-jsx or Tailwind instead)
- Create separate CSS Module files (defeats single-file maintainability goal)
- Hardcode colors, spacing, or sizing values (always use Miro tokens)
- Install additional styling libraries without explicit approval
- Use `npm` or `yarn` (use `bun` instead)
- Modify `bun.lock` or build artifacts
- Import server-only modules into client components

---

## Next.js App Router Guidelines

### Server vs Client Components
- **Default to Server Components** for better performance
- Add `use client` directive only when you need:
  - Event handlers (onClick, onChange, etc.)
  - React hooks (useState, useEffect, etc.)
  - Browser APIs (window, document, etc.)
  - Canvas manipulation

### Example:
```tsx
// Server Component (default)
export function ProductList() {
  return <div>...</div>;
}

// Client Component (when needed)
'use client';

export function InteractiveCanvas() {
  const [zoom, setZoom] = useState(1);
  return <canvas onClick={...} />;
}
```

---

## Onlook Integration Notes

This project is designed for visual editing with Onlook:

- Keep component structure **semantic and simple**
- Use descriptive class names for Onlook's element inspector
- Prefer Tailwind utilities for layout (Onlook-friendly)
- Ensure interactive elements are properly structured
- Test changes in Onlook's visual editor when possible

---

## Canvas-Specific Patterns

### Canvas Components
Canvas rendering uses HTML5 Canvas API with:
- Device pixel ratio scaling for retina displays
- Transform matrices for pan/zoom operations
- Viewport culling for performance
- Native event listeners (not React synthetic events)

### State Management
- Canvas state in React component state
- Sticky notes use individual component instances
- Multi-select with bounding box calculations

---

## Testing & Validation

Run these before committing:
```bash
bun run typecheck  # TypeScript validation
bun run lint       # ESLint checks
bun run build      # Production build test
```

---

## File Structure

```
app/                    # Next.js App Router pages
components/
  ├── canvas/          # Canvas-specific components (StickyNote, etc.)
  ├── layout/          # Layout containers (Canvas, Toolbar, etc.)
  └── ui/              # Reusable UI primitives
styles/
  └── miro-tokens.css  # Miro design system tokens
```

---

## Examples

### Good: Using Miro Component
```tsx
import { Button } from '@mirohq/design-system';

export function SaveButton() {
  return <Button onClick={handleSave}>Save</Button>;
}
```

### Good: Custom Component with styled-jsx
```tsx
export function StickyNote({ color, content }) {
  return (
    <>
      <div className="sticky-note">
        <p>{content}</p>
      </div>

      <style jsx>{`
        .sticky-note {
          background: ${color};
          border-radius: var(--radii-100);
          padding: var(--space-200);
          box-shadow: 0 2px 8px var(--colors-alpha-black-200);
        }
      `}</style>
    </>
  );
}
```

### Bad: Hardcoded values
```tsx
// ❌ DON'T DO THIS
<div style={{
  background: '#3859FF',  // Hardcoded color
  padding: '16px',        // Hardcoded spacing
  borderRadius: '8px'     // Hardcoded radius
}}>
```

### Bad: Separate CSS file for one component
```tsx
// ❌ DON'T DO THIS
import styles from './MyComponent.module.css';
// Creates maintenance overhead with separate files
```

---

## Questions?

- Check `miro-design-tokens.md` for complete token reference
- Review existing components for patterns
- Consult Miro Design System docs for component APIs
- Test in Onlook visual editor for layout validation

---

**Last Updated**: 2025-10-23
**Maintained By**: Project Team

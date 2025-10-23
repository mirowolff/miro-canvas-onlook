# Miro Canvas Clone

A high-performance, interactive canvas interface inspired by Miro, built with Next.js 15, React 19, and Tailwind CSS 4. This project implements a feature-rich canvas with pan/zoom controls, grid rendering, and a polished UI using the Miro Design System.

https://github.com/user-attachments/assets/eaa4a55c-4b50-4f60-8e3e-1b62ab0f7ac3

## Features

### Canvas Interactions
- **Pan & Zoom**: Smooth mouse wheel zoom with space+drag panning
- **Smart Grid Rendering**: Optimized dot grid that adapts to zoom levels
- **Keyboard Shortcuts**:
  - `Space` - Hold to enable panning mode
  - `R` - Reset zoom to 100%
- **High-DPI Support**: Crisp rendering on retina displays

### UI Components
- **BoardBar**: Top navigation bar with Miro branding and board information
- **CollaborationBar**: Real-time collaboration tools with user avatars
- **Toolbar**: Quick access to drawing and annotation tools
- **ZoomPanel**: Precise zoom controls with percentage display

### Design System
- Fully integrated Miro Design System tokens and icons
- Consistent spacing, colors, and typography
- Responsive component architecture

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Runtime**: React 19 with latest features
- **Styling**: Tailwind CSS 4 + styled-jsx
- **Design System**: @mirohq/design-system (full component library)
- **Design Tokens**: @mirohq/design-tokens (via design-system)
- **Icons**: @mirohq/design-system-icons (605+ icons)
- **Visual Editor**: Onlook (Next.js visual code editor)
- **Package Manager**: Bun
- **TypeScript**: Full type safety with strict mode

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/mirowolff/miro-canvas-onlook.git
cd miro-canvas-onlook

# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the canvas in action.

## Working with Onlook

This project is designed to work seamlessly with [Onlook](https://github.com/onlook-dev/onlook), a visual code editor for Next.js applications. See our [CLAUDE.md](./CLAUDE.md) file for complete AI development guidelines.

### Prompting with Onlook + Miro Design System

This project has [CLAUDE.md](./CLAUDE.md) configured with all styling conventions, so you can prompt naturally. The AI will automatically use Miro components, design tokens, and styled-jsx patterns.

#### Natural Prompts (Just Describe What You Want)

```
"Add a blue button that says 'Save'"
→ AI uses Miro's Button component with blue-500 color

"Create a settings panel with a list of options"
→ AI uses Box/Flex from Miro DS, with proper spacing tokens

"Add a card grid showing user profiles"
→ AI uses Tailwind grid + Miro tokens for styling

"Build a modal with a semi-transparent backdrop"
→ AI uses alpha-black tokens and proper z-index

"Create a toolbar button with a settings icon"
→ AI uses IconButton + @mirohq/design-system-icons
```

#### When to Be More Specific

You only need to be specific when you want something different from defaults:

```
"Create a sidebar with a green accent color"
→ Mentions color because green isn't the default

"Add a button without any icon, just text"
→ Clarifies to avoid default icon behavior

"Build a card with custom rounded corners"
→ Specifies custom styling need
```

#### Quick Tips

✅ **Just describe the UI** - The system knows to use Miro components
✅ **Mention colors by name** - "blue", "green" maps to Miro tokens
✅ **Trust the conventions** - CLAUDE.md ensures proper patterns
✅ **Override when needed** - Be specific only for exceptions

### Available Miro Components

Use these components directly in your prompts:

**Layout:**
- `Box`, `Flex`, `Grid` - Layout containers

**Interactive:**
- `Button`, `IconButton` - Buttons with Miro styling
- `Input`, `Textarea` - Form inputs
- `Checkbox`, `Switch`, `Slider` - Form controls
- `Select`, `Combobox` - Dropdowns

**Content:**
- `Badge`, `Chip`, `Tag` - Labels and tags
- `Callout` - Info boxes
- `Tooltip`, `Popover` - Overlays
- `Spinner` - Loading states

**Icons:**
- 605+ icons from `@mirohq/design-system-icons`
- Use pattern: `import { IconName } from '@mirohq/design-system-icons'`

### Design Token Reference

All Miro design tokens are available in Tailwind and CSS variables. Just use natural names:

**Colors:** `blue`, `gray`, `green`, `red`, `pink`, `purple`, `teal`, `cyan`, `orange`, `yellow`, etc.
**Transparency:** `alpha-black`, `alpha-white` for semi-transparent overlays
**Spacing:** `50`, `100`, `200`, `300`, `400`, `800` (translates to px: 4, 8, 16, 24, 32, 64)
**Rounded corners:** `50`, `100`, `200`, `round`

The AI knows how to use these. See [miro-design-tokens.md](./miro-design-tokens.md) for the complete list.

### Onlook Visual Editor Tips

1. **Component Structure**: Keep components simple and semantic for Onlook's visual editor
2. **Tailwind for Layout**: Use Tailwind classes for layout (flex, grid) - Onlook can visualize these
3. **styled-jsx for Theme**: Use styled-jsx with Miro tokens for component-specific theming
4. **Inspect Mode**: Use Onlook's inspect mode to see which Miro tokens are applied
5. **Live Preview**: Changes in Onlook sync back to your code automatically

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Main canvas page
│   └── globals.css        # Global styles and design tokens
├── components/
│   ├── layout/            # Layout components
│   │   ├── Canvas.tsx     # Main canvas with rendering logic
│   │   ├── BoardBar.tsx   # Top navigation bar
│   │   ├── CollaborationBar.tsx
│   │   ├── Toolbar.tsx
│   │   └── ZoomPanel.tsx
│   └── ui/                # Reusable UI components
│       ├── Avatar.tsx
│       ├── Button.tsx
│       └── MeAvatarWithCounter.tsx
└── styles/
    └── miro-tokens.css    # Miro Design System tokens
```

## Performance Optimizations

This project includes several optimizations for smooth canvas interactions:

1. **Batched Grid Rendering**: Grid dots are rendered in a single `fill()` call instead of individual operations
2. **Viewport Culling**: Only visible grid points are calculated and drawn
3. **Zoom Threshold**: Grid rendering is skipped when zoom level makes dots too small
4. **Canvas State Management**: Efficient state updates with `useCallback` to minimize re-renders

## Canvas Implementation Details

The canvas uses the HTML5 Canvas API with several optimizations:

- **Device Pixel Ratio**: Automatically adjusts for high-DPI displays
- **Transform Matrix**: Uses canvas transforms for smooth pan/zoom
- **Event Handling**: Native wheel events for better performance than React synthetic events
- **Memory Management**: Proper cleanup of event listeners and canvas contexts

## Customization

### Design Tokens

All design tokens are defined in `styles/miro-tokens.css` and follow the Miro Design System:

- Colors: `--colors-*`
- Typography: `--font-*`
- Spacing: Standard Miro spacing scale
- Shadows: `--shadows-*`

### Grid Configuration

Modify grid appearance in `components/layout/Canvas.tsx`:

```typescript
const GRID_SIZE = 20;        // Grid spacing in pixels
const MIN_ZOOM = 0.1;        // Minimum zoom level (10%)
const MAX_ZOOM = 5;          // Maximum zoom level (500%)
const ZOOM_STEP = 0.1;       // Zoom increment per scroll
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- Design system and icons from [Miro](https://miro.com)
- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)

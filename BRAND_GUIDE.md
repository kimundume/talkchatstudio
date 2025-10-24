# TalkChat Studio Brand Guide

## 🎨 Brand Colors

### Primary Colors
- **Orange**: `#FF8C42` - Used for primary actions, highlights, and the main brand color
- **Purple**: `#3D2E5C` - Used for secondary elements, text, and accents
- **Cream**: `#FFF5E6` - Used for backgrounds and soft highlights

### Color Usage in Tailwind

The brand colors are integrated into the Tailwind theme:

```tsx
// Primary (Orange)
<button className="bg-primary text-primary-foreground">Click me</button>

// Secondary (Purple)
<div className="bg-secondary text-secondary-foreground">Content</div>

// Accent (also Orange)
<span className="text-accent">Highlighted text</span>
```

### CSS Variables

You can also use CSS variables directly:

```css
.custom-element {
  background-color: var(--color-brand-orange);
  color: var(--color-brand-purple);
}
```

## 🖼️ Logo Usage

### Logo Component

Use the `Logo` component for consistent logo display:

```tsx
import { Logo } from '@/components/shared/Logo';

// Default (medium size with text)
<Logo />

// Small icon only
<Logo size="sm" showText={false} />

// Large with text
<Logo size="lg" showText={true} />

// Custom link
<Logo href="/custom-page" />
```

### Logo Sizes
- `sm`: 24px icon
- `md`: 32px icon (default)
- `lg`: 40px icon
- `xl`: 48px icon

## 📐 Design Principles

### Typography
- **Headings**: Bold, using gradient from orange to purple for emphasis
- **Body**: Clean, readable with good contrast
- **Buttons**: Clear call-to-action with primary orange color

### Spacing
- Border radius: `0.75rem` (12px) for a friendly, modern look
- Consistent padding and margins using Tailwind's spacing scale

### Components
- Cards: White background with subtle shadows
- Buttons: Orange primary, purple secondary
- Borders: Light gray with subtle purple tint

## 🎯 Brand Constants

Import brand constants from:

```tsx
import { BRAND_COLORS, BRAND_INFO, APP_ROUTES } from '@/constants/brand';

// Use in your components
const logoUrl = BRAND_INFO.logo;
const primaryColor = BRAND_COLORS.orange.hex;
const dashboardUrl = APP_ROUTES.dashboard;
```

## 🌓 Dark Mode

The theme automatically adjusts for dark mode:
- Background: Dark purple-tinted gray
- Primary: Slightly brighter orange
- Text: High contrast white

## ✨ Gradients

Use gradients for special emphasis:

```tsx
<h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
  TalkChat Studio
</h1>
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Logo scales appropriately on different screen sizes

## 🚀 Quick Start

1. **Import the Logo component**: `import { Logo } from '@/components/shared/Logo'`
2. **Use brand colors**: Apply `bg-primary`, `text-secondary`, etc.
3. **Reference constants**: Import from `@/constants/brand`
4. **Follow spacing**: Use Tailwind's spacing utilities consistently

---

**Remember**: Consistency is key! Always use the Logo component and brand colors to maintain a cohesive look throughout the application.

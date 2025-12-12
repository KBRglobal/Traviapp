# TRAVI Design System - Dubai Travel CMS

## Brand Overview

TRAVI is a vibrant, modern travel brand with a playful yet professional identity. The design system emphasizes clarity, accessibility, and a sense of adventure through bold colors and clean typography.

---

## Color Palette

### Primary Colors
- **Purple** (#6443F4): Primary brand color for buttons, links, and active states
- **Orange** (#FF9327): Accent for highlights, CTAs, and warm elements
- **Pink** (#F94498): Featured elements, icons, and engagement actions
- **Green** (#02A65C): Success states, positive indicators

### Secondary Shades
- Purple Light: #9077EF
- Purple Dark: #573CD0
- Orange Light: #F2CCA6
- Yellow: #FFD112
- Pink Light: #FDA9E5
- Green Light: #59ED63

### Neutrals
- White: #FFFFFF
- Black: #1A1A1A
- Gray 25: #D3CFD8 (lightest)
- Gray 50: #A79FB2
- Gray 75: #504065
- Gray 100: #24103E (darkest, primary text)

### Semantic Colors
- Success: #02A65C / #59ED63
- Warning: #FFD112
- Error/Danger: #F94498
- Info: #01BEFF

---

## Typography

### Font Families
- **Headings**: Chillax (bold, modern display font)
- **Body**: Satoshi (clean, readable sans-serif)
- **Mono**: JetBrains Mono (code, URLs, metadata)

### Heading Hierarchy
| Level | Size | Weight | Line Height |
|-------|------|--------|-------------|
| XXL (H1) | 40px | 700 | 94% |
| XL (H2) | 32px | 700 | 96% |
| L (H3) | 30px | 600 | 102% |
| M (H4) | 24px | 600 | 102% |
| S (H5/H6) | 16px | 600 | 106% |

### Body Text
| Size | Font Size | Weight | Line Height |
|------|-----------|--------|-------------|
| Large | 16px | 400/500 | 120% |
| Medium | 14px | 400/500 | 120% |
| Small | 12px | 400/500 | 120% |

---

## Spacing System

Use consistent spacing values from the TRAVI grid:

| Token | Value | Usage |
|-------|-------|-------|
| xxs | 4px | Tight icon gaps |
| xs | 8px | Form field gaps, compact lists |
| s | 12px | Card internal padding (small) |
| m | 20px | Standard card padding, section gaps |
| l | 30px | Large section padding |
| xl | 40px | Page section spacing |
| xxl | 60px | Major layout divisions |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| small | 8px | Buttons, badges |
| medium | 12px | Inputs, small cards |
| large | 16px | Cards, modals |
| full | 999px | Pills, circular elements |

---

## Shadows

| Level | Style | Usage |
|-------|-------|-------|
| Level 1 | 0px 2px 4px rgba(0,0,0,0.06) | Cards, subtle elevation |
| Level 2 | 0px 4px 12px rgba(0,0,0,0.10) | Hover states, dropdowns |
| Level 3 | 0px 6px 20px rgba(0,0,0,0.14) | Modals, floating elements |

---

## Components

### Buttons

**Primary Button**
- Background: #F24294 (Pink)
- Text: #FFFFFF
- Border: #24103E (subtle dark border)
- Hover: Slight brightness increase
- Radius: 8px

**Secondary Button**
- Background: Transparent or light
- Border: #24103E
- Text: #24103E
- Hover: Light pink tint

**Ghost/Tertiary Button**
- Background: Transparent
- Border: None or #24103E
- Text: #24103E

### Badges

| Type | Background | Text |
|------|------------|------|
| Success | #59ED63 | #24103E |
| Warning | #FFD112 | #24103E |
| Danger | #F94498 | #24103E |
| Info | #01BEFF | #24103E |

- Radius: 12px
- Padding: 6px 10px

### Cards

- Background: #FFFFFF
- Border Radius: 16px
- Padding: 20px
- Shadow: Level 1 (0px 2px 4px rgba(0,0,0,0.06))
- Border: None (shadow provides definition)

### Inputs

- Background: #FFFFFF
- Border: rgba(36, 16, 62, 0.30)
- Focus Border: #6443F4 (Purple)
- Text: #24103E
- Placeholder: rgba(36, 16, 62, 0.50)
- Radius: 12px
- Padding: 14px

### Search Bar

- Background: #FFFFFF
- Icon Color: #6443F4
- Radius: 16px
- Border: rgba(36, 16, 62, 0.30)
- Focus Border: #6443F4
- Height: 56px

---

## Navigation

### Sidebar Navigation

- Background: Light purple tint (near white)
- Item Padding: 12px 16px
- Active Item Background: #FEECF4 (pink tint)
- Active Icon Color: #F94498 (Pink)
- Inactive Icon Color: #24103E
- Active/Inactive Text: #24103E

### Top Navigation

- Background: #FFFFFF
- Border Bottom: subtle gray
- Logo placement: Left
- Actions: Right-aligned

---

## Icons

Use Font Awesome 6 Pro or Lucide React icons.

- Default Size: 24px
- Active State: Filled style, #F94498 (Pink)
- Active Background: #FEECF4
- Inactive State: Outline style, #24103E

---

## Grid System

### Desktop (Web)
- Columns: 12
- Margin: 140px
- Gutter: 30px

### Mobile
- Columns: 6
- Margin: 20px
- Gutter: 12px

---

## Status Badges (Content Workflow)

| Status | Background | Text |
|--------|------------|------|
| Draft | Gray (#D3CFD8) | #24103E |
| In Review | Yellow (#FFD112) | #24103E |
| Approved | Green (#02A65C) | #FFFFFF |
| Scheduled | Purple (#6443F4) | #FFFFFF |
| Published | Pink (#F94498) | #FFFFFF |

---

## Content Type Badges

| Type | Color Theme |
|------|-------------|
| Attraction | Blue (#01BEFF) |
| Hotel | Orange (#FF9327) |
| Article | Green (#02A65C) |
| Dining | Pink (#F94498) |
| District | Purple (#6443F4) |
| Transport | Cyan (#01BEFF) |

---

## Accessibility

- All interactive elements keyboard accessible
- Focus states with visible ring (Purple #6443F4)
- WCAG AA color contrast minimum
- ARIA labels for icon-only buttons
- Clear error messages for forms

---

## Dark Mode

Dark mode inverts the color scheme while maintaining brand consistency:
- Background: Deep purple-black (#24103E tints)
- Text: White/Light gray
- Cards: Slightly lighter than background
- Primary colors: Slightly brighter for contrast
- Shadows: Increased opacity for visibility

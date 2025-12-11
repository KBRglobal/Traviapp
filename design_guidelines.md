# Dubai Travel CMS (Travi) - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Material Design 3 / Modern Admin)

**Rationale:** This is a productivity-focused content management system requiring efficiency, learnability, and information density. The interface prioritizes functionality over visual storytelling, with content editors as primary users who need clear workflows, scannable data tables, and intuitive form controls.

**Core Principles:**
- Clarity over decoration
- Information hierarchy through spacing and typography
- Consistent patterns across all content types
- Minimal cognitive load for repetitive tasks

---

## Typography System

**Font Stack:**
- Primary: Inter (Google Fonts) - for UI elements, labels, body text
- Monospace: JetBrains Mono - for code snippets, URLs, metadata

**Hierarchy:**
- Page Headers (H1): text-2xl (24px), font-semibold
- Section Headers (H2): text-xl (20px), font-semibold  
- Subsection Headers (H3): text-lg (18px), font-medium
- Card Titles: text-base (16px), font-medium
- Body Text: text-sm (14px), font-normal
- Helper Text/Labels: text-xs (12px), font-normal
- Data/Metadata: text-xs (12px), font-mono

---

## Layout & Spacing

**Core Spacing Units:** Use Tailwind units of 2, 3, 4, 6, 8, 12, 16

**Layout Structure:**
- Sidebar Navigation: w-64 (256px), fixed left
- Main Content Area: Remaining width with max-w-7xl container, px-6 py-8
- Cards/Panels: p-6 with mb-6 spacing between
- Form Fields: space-y-4 for vertical stacking
- Grid Layouts: gap-6 for card grids

**Container Widths:**
- Dashboard cards: Full width in grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Content editor: max-w-4xl centered for optimal reading/editing
- Tables: Full width with horizontal scroll on mobile
- Forms: max-w-2xl for single-column layouts

---

## Component Library

### Navigation
**Sidebar Navigation:**
- Fixed left sidebar with logo at top
- Icon + text menu items with hover states
- Active state with accent border-left
- Collapsible sections for content types (Attractions, Hotels, Articles)
- User profile/settings at bottom

**Top Bar:**
- Breadcrumb navigation (Home > Content Library > Edit Attraction)
- Quick actions (Preview, Save Draft, Publish)
- Search bar (w-96) for global content search
- Notification bell + user avatar

### Content Library (Dashboard)
**Data Table:**
- Headers with sorting indicators
- Row hover states
- Status badges (Draft, In Review, Published)
- Action dropdown (Edit, Preview, Delete) per row
- Pagination at bottom
- Bulk action checkbox column

**Filters Panel:**
- Collapsible left panel or top bar
- Filter chips showing active filters
- Date range picker, status dropdown, category selector

### Block-Based Editor
**Toolbar:**
- Sticky top bar with save/preview/publish actions
- Block type selector (dropdown with icons)
- Undo/redo buttons

**Canvas Area:**
- Center column (max-w-4xl) for main content
- Right sidebar (w-80) for block settings
- Block controls appear on hover (drag handle, delete, duplicate)
- Add block button (+ symbol) between blocks

**Block Types:**
- Hero Section: Full-width with image upload + overlay controls
- Text Editor: WYSIWYG with formatting toolbar
- Image Gallery: Grid with drag-to-reorder
- FAQ Accordion: Collapsible Q&A pairs
- CTA Button: Link input + style options
- Info Grid: Icon + label + value triplets

### Forms & Inputs
**Text Fields:**
- Outlined style with floating labels
- Helper text below field
- Error states with red border + error message
- Character count for meta descriptions/titles

**Rich Text Editor:**
- Toolbar with formatting options (bold, italic, headings, lists, links)
- Word count display
- Expandable full-screen mode

**Media Upload:**
- Drag-and-drop zone with file browser fallback
- Image preview thumbnails with edit/delete actions
- Alt text input below each image
- File size/format validation messages

**Select/Dropdown:**
- Searchable dropdowns for long lists
- Multi-select with chip display for categories/tags

### Preview Mode
**Preview Panel:**
- Toggle between Desktop (full width) and Mobile (max-w-sm centered)
- Device frame decoration
- Scroll within iframe
- Close/edit buttons at top

### Status & Workflow
**Status Badges:**
- Draft: Gray background, dark text
- In Review: Yellow background, dark text
- Approved: Green background, white text
- Published: Blue background, white text
- Scheduled: Purple background, white text

**Workflow Actions:**
- Linear progression: Submit for Review → Approve → Schedule → Publish
- Action buttons at top of editor (primary accent color)
- Confirmation modals for destructive actions

### SEO Panel
**Metadata Section:**
- Meta title input (60 char limit with indicator)
- Meta description textarea (155 char limit)
- URL slug input with auto-generate option
- Primary/secondary keyword tags

**Schema Preview:**
- Collapsible JSON-LD code block
- Validation status indicators (checkmark or warning icon)
- Schema type selector (Article, Hotel, Attraction)

### Media Library
**Grid View:**
- Thumbnail grid (grid-cols-4 lg:grid-cols-6)
- Image filename below thumbnail
- Checkbox for multi-select
- Upload button at top-right

**Detail View:**
- Large preview image
- Edit alt text, filename
- Image dimensions, file size, upload date
- Delete button

### Analytics Dashboard (Future Phase)
**Metrics Cards:**
- Grid of KPI cards (grid-cols-4)
- Icon, label, large number, trend indicator
- Clickable for detailed view

**Charts:**
- Line graphs for traffic over time
- Bar charts for content performance
- Tables for top-performing pages

---

## Interaction Patterns

**Loading States:**
- Skeleton screens for content loading
- Spinner for action processing (save, publish)
- Progress bar for bulk operations

**Notifications:**
- Toast messages (top-right corner)
- Success (green), Error (red), Warning (yellow), Info (blue)
- Auto-dismiss after 4 seconds with manual dismiss option

**Modals:**
- Centered overlay for confirmations
- Max-w-lg with backdrop blur
- Primary action (right) + Cancel (left) buttons

**Drag & Drop:**
- Visual feedback on drag start (slight opacity reduction)
- Drop zones highlighted with dashed border
- Reorder animations for list/grid items

---

## Accessibility

- All interactive elements keyboard accessible (tab navigation)
- Focus states with visible outline (ring-2 ring-offset-2)
- ARIA labels for icon-only buttons
- Sufficient color contrast (WCAG AA minimum)
- Form validation with clear error messages
- Screen reader announcements for dynamic content updates

---

## Images

**No large hero images** - This is an admin interface, not a marketing site.

**Where images appear:**
- Logo in sidebar (small, 40x40px)
- User avatars (32x32px circular)
- Content thumbnails in tables/library (80x80px)
- Preview images in block editor (variable, optimized per content type)
- Placeholder icons for empty states
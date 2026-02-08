# Slim Rail - Quick Reference Guide

## 🚀 Quick Start

### For Users
1. **Collapse Sidebar**: Click the **X** icon at the top of the sidebar
2. **Expand Sidebar**: Click the **≡** icon on the slim rail
3. In collapsed state, only icons are visible
4. In expanded state, full sidebar with all features is shown

### For Developers

#### View the Changes
```bash
# See what was modified
git diff

# Or view specific files:
code components/ConversationSidebar.tsx
code app/dashboard/page.tsx
code app/globals.css
```

#### Build & Test Locally
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Navigate to dashboard
# Open http://localhost:3000/dashboard

# Build for production
pnpm build
```

#### Key Files to Know
| File | Purpose |
|------|---------|
| `components/ConversationSidebar.tsx` | Main sidebar component (modified) |
| `app/dashboard/page.tsx` | Dashboard layout (modified) |
| `app/globals.css` | Global styles with transition utilities (modified) |

---

## 📋 Implementation Overview

### New Props Added to ConversationSidebar

```typescript
interface ConversationSidebarProps {
  // ... existing props ...
  isCollapsed?: boolean;           // NEW: Controls collapsed state
  onToggleCollapse?: () => void;   // NEW: Toggle callback
}
```

### State Management in Dashboard

```typescript
// In app/dashboard/page.tsx
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

// Pass to sidebar
<ConversationSidebar
  isCollapsed={isSidebarCollapsed}
  onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
  // ... other props ...
/>
```

---

## 🎨 CSS Classes Reference

### Width States
```css
/* Expanded (Default) */
w-64        /* 256px - Full sidebar width */

/* Collapsed */
w-[70px]    /* 70px - Slim rail width */
```

### Transitions
```css
transition-all duration-300 ease-in-out
/* Applies smooth transitions to width and opacity */
```

### Colors
```css
bg-[#2d1b4e]              /* Sidebar background */
border-[#7B3FF2]/30       /* Border color */
text-[#A78BFA]            /* Icon color */
bg-[#7B3FF2]              /* Button background */
hover:bg-[#6B46C1]        /* Button hover color */
```

---

## 🔧 Customization Guide

### Change Sidebar Widths
In `ConversationSidebar.tsx`, find the main div:
```tsx
w-[70px]     // Change this for collapsed width
w-64         // Change this for expanded width (w-64 = 256px)
```

### Adjust Animation Speed
In `ConversationSidebar.tsx` or add to `globals.css`:
```css
duration-300    /* Change to duration-200, duration-500, etc. */
ease-in-out     /* Change to ease-in, ease-out, linear, etc. */
```

### Edit Colors
Update these Tailwind classes:
```css
bg-[#2d1b4e]         /* Change sidebar background */
border-[#7B3FF2]/30  /* Change border color and opacity */
text-[#A78BFA]       /* Change icon colors */
bg-[#7B3FF2]         /* Change button background */
```

### Add/Remove Icons
Edit the imports at the top of `ConversationSidebar.tsx`:
```tsx
import { ChevronDown, Plus, Settings, Menu, X } from "lucide-react";
// Add or remove icon names as needed
```

---

## 🧪 Testing Checklist

- [ ] Sidebar collapses on button click
- [ ] Sidebar expands on button click
- [ ] Transitions are smooth (~300ms)
- [ ] Icons visible in collapsed state
- [ ] Text hidden in collapsed state
- [ ] Content visible in expanded state
- [ ] Main content resizes appropriately
- [ ] No layout shifts or visual glitches
- [ ] Dark theme maintained
- [ ] All interactive elements responsive
- [ ] No console errors
- [ ] Build completes successfully

---

## 💡 Code Snippets

### Conditional Rendering Pattern Used
```tsx
// Content only shown when expanded
{!isCollapsed && (
  <div>Brain Logo, Lens Switcher, Mode Filter, Conversations</div>
)}

// Content only shown when collapsed
{isCollapsed && (
  <div>Icon-only buttons and spacer</div>
)}
```

### Main Container Pattern
```tsx
<div className={`
  bg-[#2d1b4e] 
  border-r border-[#7B3FF2]/30 
  flex flex-col 
  transition-all duration-300 ease-in-out 
  h-full 
  flex-shrink-0 
  overflow-hidden 
  ${isCollapsed ? 'w-[70px]' : 'w-64'}
`}>
```

### Toggle Button Pattern
```tsx
<button
  onClick={onToggleCollapse}
  className="w-full py-4 px-2 hover:bg-[#7B3FF2]/10 transition-colors 
             flex items-center justify-center text-[#A78BFA]"
  title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
>
  {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
</button>
```

---

## 📊 Architecture Diagram

```
Dashboard Page
  └─ <div className="flex h-screen">
       ├─ ConversationSidebar
       │  ├─ Props: isCollapsed, onToggleCollapse
       │  └─ Content:
       │     ├─ Expander (≡/X)
       │     ├─ Logo & Lens
       │     ├─ New Chat & Filter
       │     ├─ Conversations List
       │     └─ Settings Icon
       │
       └─ Main Content (flex-1)
          ├─ Header
          ├─ Messages Area
          └─ Input Area

CSS Transitions:
  └─ transition-all duration-300 ease-in-out
     └─ width: 256px ↔ 70px
     └─ opacity: 1 ↔ 0 (content)
```

---

## 🐛 Troubleshooting

### Sidebar Not Transitioning Smoothly
**Solution**: Ensure `transition-all duration-300` is on main div
```tsx
// Should have:
className={`... transition-all duration-300 ease-in-out ...`}
```

### Icons Not Visible
**Solution**: Check icon colors and sizing
```tsx
// Ensure:
text-[#A78BFA]  // Light violet color
w-5 h-5         // Proper sizing
```

### Content Overflow
**Solution**: Add `overflow-hidden` to main container
```tsx
className={`... overflow-hidden ...`}
```

### Layout Shifts
**Solution**: Use `flex-shrink-0` on sidebar
```tsx
className={`... flex-shrink-0 ...`}
```

### State Not Persisting
**Solution**: Save to localStorage if needed
```typescript
// In Dashboard or sidebar component:
useEffect(() => {
  localStorage.setItem('sidebar_collapsed', isSidebarCollapsed);
}, [isSidebarCollapsed]);
```

---

## 📚 Related Documentation

- **Full Technical Details**: `SLIM_RAIL_IMPLEMENTATION.md`
- **Testing Procedures**: `SLIM_RAIL_TESTING.md`
- **Implementation Summary**: `SLIM_RAIL_SUMMARY.md`
- **Architecture Reference**: `SLIM_RAIL_ARCHITECTURE.md`

---

## 🎯 Common Tasks

### Task: Change Rail Width from 70px to 80px
```css
// In ConversationSidebar.tsx, change:
w-[70px]   →   w-[80px]
```

### Task: Make Transitions Faster
```css
// Change duration-300 to:
duration-200   // 200ms (faster)
duration-250   // 250ms (slightly faster)
```

### Task: Make Transitions Slower
```css
// Change duration-300 to:
duration-500   // 500ms (slower)
duration-700   // 700ms (much slower)
```

### Task: Change Icon Colors
```css
// Change text-[#A78BFA] to another color
text-blue-400
text-green-400
text-purple-300
// Or use: text-[#YOURCOLOR]
```

### Task: Add New Icon to Slim Rail
1. Import icon from lucide-react
2. Add to slim rail section inside `{isCollapsed &&}` block
3. Style with same pattern as existing icons

---

## ✨ Best Practices

1. **Always test after changes**: Run `pnpm build` to catch errors
2. **Maintain consistency**: Keep styling consistent with existing theme
3. **Test on desktop and tablet**: Check responsive behavior
4. **Use Tailwind classes**: Stick to utility classes, avoid custom CSS
5. **Keep transitions smooth**: Don't make animations too slow or fast
6. **Preserve accessibility**: Keep proper contrast ratios and titles
7. **Document changes**: Update relevant docs if making major changes

---

## 🔗 Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build production release
pnpm lint             # Check for issues

# Cleanup
pnpm install          # Install/update dependencies
rm -rf .next          # Clear build cache

# Diagnostics
pnpm build 2>&1 | grep error    # Find build errors
git status                       # See what changed
```

---

## 📞 Quick Help

**Q: How do I toggle the sidebar?**
A: Click the X icon (expanded) or ≡ icon (collapsed) at the top of the sidebar.

**Q: How do I change the sidebar width?**
A: Edit `w-[70px]` and `w-64` classes in ConversationSidebar.tsx.

**Q: How do I speed up transitions?**
A: Change `duration-300` to `duration-200` or lower.

**Q: Where do I add new features to the slim rail?**
A: Inside the `{isCollapsed && (...)}` blocks in ConversationSidebar.tsx.

**Q: Will this work on mobile?**
A: Yes, it will work the same as desktop. Future optimization possible.

**Q: Can I save the collapsed state?**
A: Yes, add localStorage handling in the Dashboard component's useEffect.

---

## 🎓 Learning Resources

### Tailwind CSS
- Transitions: https://tailwindcss.com/docs/transition
- Width: https://tailwindcss.com/docs/width
- Spacing: https://tailwindcss.com/docs/space

### Lucide React
- Icon Library: https://lucide.dev
- React Component Docs: https://github.com/lucide-icons/lucide

### React Documentation
- State Management: https://react.dev/learn/state
- Conditional Rendering: https://react.dev/learn/conditional-rendering

---

**Last Updated**: February 8, 2026
**Version**: 1.0
**Status**: ✅ Complete

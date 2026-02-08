# Slim Rail - Quick Testing Guide

## Visual Testing Steps

### 1. Sidebar Collapse/Expand
- [ ] Navigate to the Dashboard
- [ ] Locate the sidebar on the left side
- [ ] Click the **X icon** at the top of the sidebar to collapse it
- [ ] Verify the sidebar smoothly transitions to 70px width
- [ ] Verify only icons are visible (no text labels)
- [ ] Click the **≡ icon** to expand the sidebar
- [ ] Verify the sidebar smoothly transitions back to 256px width
- [ ] Verify all content is visible again

### 2. Collapsed State (Slim Rail)
When collapsed, verify the following are visible:
- [ ] **Menu icon** (≡) at the very top - clickable to expand
- [ ] **New Chat icon** (⊕) - below the menu icon
- [ ] **Settings icon** (⚙) - at the bottom
- [ ] **No text labels** visible
- [ ] **Proper spacing** between buttons

### 3. Expanded State (Full Sidebar)
When expanded, verify the following:
- [ ] **X icon** (✕) at the very top - clickable to collapse
- [ ] **Brain Logo** - below the X icon
- [ ] **Lens Switcher** (if admin user) - with current lens highlighted
- [ ] **"New Chat" button** - with icon + text, clickable
- [ ] **Mode Filter dropdown** - if multiple modes available
- [ ] **"Recent Chats" header** - section title
- [ ] **Conversation items** - with title, mode, and timestamp
- [ ] **Delete buttons** - appear on hover
- [ ] **Footer text** - "Powered by EPI Brain"

### 4. Interactions
- [ ] **New Chat button** works in both states
- [ ] **Conversation selection** works in expanded state
- [ ] **Lens switching** works (admin only)
- [ ] **Mode filtering** works in expanded state
- [ ] **Delete functionality** works
- [ ] **Hover effects** appear on all interactive elements

### 5. Smooth Transitions
- [ ] Expansion takes ~300ms (not instant, not too slow)
- [ ] Content appears/disappears smoothly
- [ ] No layout shifts during expansion/collapse
- [ ] No text overlap or visual glitches
- [ ] Main content area resizes smoothly alongside sidebar

### 6. Dark Theme Verification
- [ ] Background color is correct purple (`#2d1b4e`)
- [ ] Border color is subtle violet with transparency
- [ ] Icon colors are light violet (`#A78BFA`)
- [ ] Hover states show appropriate color changes
- [ ] Active conversation has proper highlight color

### 7. Responsive Testing

**Desktop (> 1024px):**
- [ ] Sidebar always visible in both states
- [ ] Toggle button works correctly
- [ ] Main content area resizes smoothly
- [ ] No mobile overlays appear

**Tablet (768px - 1024px):**
- [ ] Sidebar visibility behavior consistent
- [ ] Icons properly sized for touch
- [ ] Buttons have adequate touch targets (44px minimum)

**Mobile (< 768px):**
- [ ] Consider if current behavior is optimal
- [ ] May need future mobile-specific adjustments

### 8. Performance
- [ ] No stuttering during transitions
- [ ] No lag when clicking buttons
- [ ] Smooth scrolling in conversation list when expanded
- [ ] Quick response to user interactions

### 9. Accessibility
- [ ] Icons are identifiable visually
- [ ] Buttons have titles for tooltips
- [ ] Color contrast is sufficient
- [ ] Can navigate with keyboard (Tab key)

### 10. Edge Cases
- [ ] Long conversation titles truncate properly
- [ ] Many conversations scroll smoothly
- [ ] No conversations state displays helpful message
- [ ] Filter dropdown works correctly
- [ ] Delete confirmation still functions

## Quick Visual Checklist

```
SIDEBAR TRANSITIONS:
[✓] Collapse animation smooth
[✓] Expand animation smooth
[✓] Width changes from 256px to 70px
[✓] No content overflow

COLLAPSED STATE (70px):
[✓] Menu icon visible at top
[✓] New Chat icon visible
[✓] Settings icon visible at bottom
[✓] No text labels
[✓] Button hover effects work

EXPANDED STATE (256px):
[✓] X icon at top
[✓] Brain logo visible
[✓] Recent chats visible
[✓] All text labels visible
[✓] Footer text visible

COLOR SCHEME:
[✓] Dark purple background
[✓] Violet accents and borders
[✓] Light text for contrast
[✓] Hover states clear

FUNCTIONALITY:
[✓] New Chat works both states
[✓] Conversation selection works
[✓] Toggle button responsive
[✓] No broken links or errors
```

## How to Run Tests

1. **Start Development Server:**
   ```bash
   cd /workspaces/epi-brain-frontend
   pnpm dev
   ```

2. **Open in Browser:**
   ```
   http://localhost:3000/dashboard
   ```

3. **Test Each Scenario:**
   - Follow steps 1-10 above
   - Take note of any issues
   - Check console for errors

4. **Build Verification:**
   ```bash
   pnpm build
   ```
   - Should complete without errors

## Expected Behavior

### Expand/Collapse Flow
```
INITIAL STATE (EXPANDED):
┌─────────────────────────┐
│ [X]                     │
├─────────────────────────┤
│ 🧠 Brain Logo          │
├─────────────────────────┤
│ [Lens Selector]        │
├─────────────────────────┤
│ [+ New Chat]           │
├─────────────────────────┤
│ Recent Chats            │
├─────────────────────────┤
│ • Chat 1                │
│ • Chat 2                │
│ • Chat 3                │
└─────────────────────────┘

AFTER COLLAPSE (300ms transition):
┌────┐
│[≡] │ Menu icon
├────┤
│[⊕] │ New Chat icon
├────┤
│    │ Empty space
├────┤
│[⚙] │ Settings icon
└────┘
```

## Known Limitations & Future Work

1. **Mobile Behavior**: May need optimization for very small screens
2. **Keyboard Shortcuts**: No Cmd/Ctrl + B shortcut yet
3. **State Persistence**: Collapsed state resets on page reload
4. **Profile Menu**: Settings icon doesn't have a menu yet
5. **Search**: No conversation search in collapsed state

## Browser DevTools Tips

**Check Animations:**
- Open DevTools → Elements → Find sidebar div
- Look for `transition-all duration-300` class
- Check computed styles for width transitions

**Debug Issues:**
- Check Console for errors
- Inspect element to verify classes are applied
- Check for conflicting CSS in user styles
- Disable extensions if seeing unexpected behavior

## Success Criteria

- ✅ Build succeeds with no errors
- ✅ Sidebar transitions smoothly
- ✅ Both collapsed and expanded states work
- ✅ All icons visible in collapsed state
- ✅ All content visible in expanded state
- ✅ Interactive elements responsive
- ✅ No visual glitches or layout shifts
- ✅ Users can easily toggle between states
- ✅ Dark theme and colors maintained
- ✅ Performance is smooth (60fps transitions)

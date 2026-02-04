# Quick Testing Guide - Pocket Assistant Features

## 🚀 Quick Start

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to**: `http://localhost:3000/dashboard`

## 📋 Feature Testing

### 1. Voice-First Interaction

#### Desktop PTT (Spacebar)
1. Enable voice in the header toggle
2. **Hold spacebar** - should see "Listening..." indicator at bottom center
3. Speak something
4. **Release spacebar** - transcript should send as message
5. Try typing in input box - spacebar should insert space, not trigger PTT ✓

#### Mobile PTT (Tap to Toggle)
1. Open on mobile device or resize browser to < 768px
2. Look for large purple mic button in bottom-right
3. **Tap once** - button turns red with pulse animation
4. Speak something
5. **Tap again** - recording stops and sends

#### Live Transcript
1. Start recording (spacebar or mobile tap)
2. Look above the input box - should see purple glass bubble
3. Watch transcript update in real-time as you speak
4. Should show "EPI is hearing..." label
5. Pulsing mic icon and blinking cursor visible
6. Fades out after recording stops

### 2. Quick Actions (Mobile FAB)

1. **Resize browser to mobile** (< 768px) or use device
2. Look for purple **+** button in bottom-right (above PTT button if voice enabled)
3. **Tap +** button - should expand to show 3 actions
4. Verify staggered animation (actions appear one by one)
5. Backdrop should blur the background

#### Test Each Action:
- **📝 New Note** (blue) - Creates quick note, check console for success
- **💼 Sales Mode** (green) - Mode selector should change to "Sales"
- **✉️ Message Admin** (purple) - Sends message, check console

6. **Close** - Tap X or backdrop

### 3. The Vault

#### Opening Vault
1. Look in header (top-right area)
2. Click **Archive icon** (🗄️) next to voice toggle
3. Vault sidebar should slide in from right
4. Hover over icon - tooltip shows "🔐 Vault"

#### Testing Vault Features
1. **Filters** - Click tabs: All, Note, Draft, Reflection, Quick
2. **Create test notes**:
   - Use Quick Actions → New Note (mobile)
   - Or call API directly via browser console:
   ```javascript
   fetch('/api/v1/assistant-tools/notes', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${localStorage.getItem('access_token')}`
     },
     body: JSON.stringify({
       title: 'Test Note',
       content: 'This is a test note',
       type: 'note'
     })
   })
   ```

3. **View note** - Click any note card
4. **Full view** should overlay
5. **Back button** returns to list
6. **Delete** - Hover over note, click trash icon
7. **Empty state** - Filter to type with no notes

### 4. Admin Analytics

#### Access
1. Navigate to: `http://localhost:3000/admin/analytics`
2. Should show usage dashboard (if authenticated)

#### Testing Table
1. **Summary cards** - Verify totals display
2. **Filter buttons** - Click each plan tier (All, Free, Basic, Pro, Enterprise)
3. **Sorting** - Click column headers:
   - Click once: Sort descending
   - Click twice: Sort ascending
   - Arrow icon shows active sort
4. **Hover effects** - Row highlights on hover
5. **Plan badges** - Should be color-coded by tier

#### Mobile View
1. Resize to mobile width
2. Table should scroll horizontally
3. Cards should stack vertically
4. All text should remain readable

## 🎨 Visual Checks

### Glass-morphic Styling
- [ ] Purple gradient backgrounds (`#7B3FF2` to `#6B46C1`)
- [ ] Backdrop blur effects
- [ ] White borders with 10% opacity
- [ ] Glow effects on hover
- [ ] Smooth transitions (300ms)

### Animations
- [ ] FAB actions stagger in (50ms delay each)
- [ ] Pulse animations when active
- [ ] Smooth slide transitions
- [ ] Fade in/out effects

### Responsive Design
- [ ] All mobile features hidden on desktop
- [ ] Buttons are thumb-sized (64x64px minimum)
- [ ] No horizontal scrolling on mobile
- [ ] Touch targets don't overlap

## 🐛 Common Issues & Fixes

### Voice Features Not Working
- **Check browser support**: Chrome/Edge support Web Speech API
- **Check microphone permissions**: Browser should prompt for access
- **Check console**: Look for speech recognition errors

### Notes Not Loading in Vault
- **Check authentication**: Ensure logged in
- **Check API endpoint**: Backend should have `/api/v1/assistant-tools/notes`
- **Check network tab**: Verify API calls succeed (200 status)

### FAB Not Appearing
- **Check viewport width**: FAB is mobile-only (< 768px)
- **Check z-index**: Should be z-50
- **Check CSS**: Ensure Tailwind CSS is loaded

### Admin Analytics 403 Error
- **Backend authorization**: Admin role required
- **Token validation**: Check if access token is valid
- **API implementation**: Ensure `/api/v1/admin/usage` exists

## 📱 Mobile Device Testing

### iOS Safari
1. Open in Safari on iPhone/iPad
2. Test PTT tap-to-toggle
3. Test voice permissions prompt
4. Verify FAB button positioning
5. Check scroll behavior in Vault

### Android Chrome
1. Open in Chrome on Android
2. Test all voice features
3. Verify touch targets are accessible
4. Check keyboard behavior with inputs

## ✅ Success Criteria

All features should:
- ✅ Load without console errors
- ✅ Match the glass-morphic purple design system
- ✅ Be responsive on mobile and desktop
- ✅ Provide visual feedback for all interactions
- ✅ Handle errors gracefully
- ✅ Maintain performance (no lag)

## 🔍 Debug Tools

### Browser Console Commands
```javascript
// Check voice manager
voiceManagerRef.current

// Check authentication
localStorage.getItem('access_token')

// Test API directly
await fetch('/api/v1/assistant-tools/notes', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
}).then(r => r.json())

// Check localStorage state
localStorage.getItem('active_lens')
localStorage.getItem('epi_silo_name')
```

### React DevTools
1. Install React DevTools extension
2. Inspect component state:
   - `isListening`
   - `liveTranscript`
   - `isVaultOpen`
   - `voiceManagerRef`

## 📊 Performance Checks

- [ ] Live transcript updates without lag
- [ ] FAB animations are smooth (60fps)
- [ ] Vault loads notes quickly (< 1s)
- [ ] Admin table sorts instantly
- [ ] No memory leaks (check DevTools Memory tab)

## 🎯 Test Complete!

If all checks pass, the Pocket Assistant features are ready for production! 🎉

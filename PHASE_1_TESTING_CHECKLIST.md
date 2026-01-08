# Phase 1 Voice Integration - Testing Checklist

## 🎯 Testing Objectives
Verify all voice features work correctly in production before proceeding to Phase 2.

---

## 📋 Pre-Testing Setup

### Environment Preparation
- [ ] Clear browser cache and cookies
- [ ] Use Chrome, Firefox, Safari, or Edge (latest version)
- [ ] Ensure browser allows audio playback
- [ ] Check speakers/audio output is working
- [ ] Test on desktop and mobile (if possible)

### Account Preparation
- [ ] Have test account credentials ready
- [ ] Note current voice usage count (check backend)
- [ ] Know user tier (FREE or PRO)

---

## 🧪 Core Functionality Tests

### 1. Voice Toggle Test
**Steps**:
1. Login to your account at https://epibraingenius.com
2. Navigate to dashboard
3. Locate voice toggle in header (right side)
4. Click to enable voice
5. Observe toggle state changes
6. Click to disable voice
7. Observe toggle state changes

**Expected Results**:
- [ ] Toggle shows "Voice Off" initially
- [ ] Toggle changes to "Voice On" when enabled
- [ ] Toggle shows voice stats (e.g., "10/100") if enabled
- [ ] Toggle has purple glow when enabled
- [ ] Toggle has loading state when enabling
- [ ] No console errors

---

### 2. Gender Selection Test
**Steps**:
1. With voice enabled, click on gender selector
2. Observe dropdown menu appears
3. Click on "Male" option
4. Observe selection updates
5. Click on gender selector again
6. Click on "Female" option
7. Observe selection updates

**Expected Results**:
- [ ] Dropdown shows current selection
- [ ] Both "Male" and "Female" options visible
- [ ] Voice name displayed (e.g., "Asteria" for male)
- [ ] Voice description shown (e.g., "Friendly and casual")
- [ ] Selection updates immediately
- [ ] Dropdown closes after selection
- [ ] No console errors

---

### 3. Voice Playback Test
**Steps**:
1. Enable voice toggle
2. Select a personality mode (e.g., "Personal Friend")
3. Select gender (e.g., "Female")
4. Send a message to AI
5. Wait for AI response
6. Listen to audio playback

**Expected Results**:
- [ ] AI text response appears
- [ ] Audio visualizer appears below message
- [ ] Audio visualizer animates during playback
- [ ] Audio plays smoothly
- [ ] Voice matches selected gender
- [ ] Voice quality is clear
- [ ] Audio duration ~5-15 seconds (typical response)
- [ ] No audio glitches or stuttering

---

### 4. Audio Visualizer Test
**Steps**:
1. Send a message while voice is enabled
2. Observe visualizer during playback
3. Click mute button
4. Observe visualizer stops animating
5. Click mute button again
6. Observe visualizer resumes

**Expected Results**:
- [ ] Visualizer shows 20 animated bars
- [ ] Bars animate with random heights
- [ ] Colors are purple gradient
- [ ] Visualizer appears below AI response
- [ ] Mute button toggles volume icon
- [ ] Visualizer stops when muted
- [ ] Visualizer resumes when unmuted
- [ ] Visualizer disappears after playback ends

---

### 5. Voice Stats Test
**Steps**:
1. Check voice toggle when disabled (note stats)
2. Enable voice toggle
3. Send 1-2 messages
4. Check voice toggle again
5. Observe stats updated

**Expected Results**:
- [ ] Stats show "X/Y" format (remaining/limit)
- [ ] FREE tier: Shows "10/10" initially
- [ ] PRO tier: Shows "Unlimited" or large number
- [ ] Stats decrease after each voice response
- [ ] Stats update in real-time
- [ ] Stats persist after page refresh
- [ ] No console errors

---

### 6. Mode Switching Test
**Steps**:
1. Enable voice in "Personal Friend" mode
2. Switch to "Sales Agent" mode
3. Send message
4. Observe voice changes
5. Switch to "Student Tutor" mode
6. Observe voice behavior

**Expected Results**:
- [ ] Voice works in "Personal Friend"
- [ ] Voice works in "Sales Agent"
- [ ] Voice quality differs by mode (different voice model)
- [ ] Voice is disabled in "Student Tutor"
- [ ] Error tooltip shows for "Student Tutor"
- [ ] Gender selector updates with mode
- [ ] Voice preference persists across modes

---

## 🚨 Error Handling Tests

### 7. Voice Limit Test (FREE Tier)
**Steps**:
1. Use a FREE tier account
2. Enable voice
3. Send 10 messages (or reach limit)
4. Try to send 11th message
5. Observe behavior

**Expected Results**:
- [ ] Voice works for first 10 messages
- [ ] 11th message shows error tooltip
- [ ] Error message: "Voice limit reached for today"
- [ ] Voice toggle shows "0/10" stats
- [ ] AI still responds with text (no audio)
- [ ] No console errors
- [ ] User can still use chat normally

---

### 8. Network Error Test
**Steps**:
1. Enable voice
2. Disconnect internet (or use browser DevTools to block WebSocket)
3. Send message
4. Observe error handling
5. Reconnect internet
6. Try voice again

**Expected Results**:
- [ ] Error message shows to user
- [ ] Voice stops gracefully
- [ ] AI text response still appears
- [ ] No infinite loading states
- [ ] Console shows WebSocket error
- [ ] Voice works again after reconnect
- [ ] Auto-reconnection attempts (up to 3 times)

---

### 9. Disabled Mode Test
**Steps**:
1. Switch to "Student Tutor" mode
2. Try to enable voice
3. Observe behavior

**Expected Results**:
- [ ] Voice toggle is disabled (opacity reduced)
- [ ] Hover shows "cursor-not-allowed"
- [ ] Click shows error tooltip
- [ ] Error: "Voice is not available for this mode"
- [ ] Tooltip disappears after 3 seconds
- [ ] No console errors

---

## 🎨 UI/UX Tests

### 10. Responsive Design Test
**Steps**:
1. Test on desktop (1920x1080)
2. Test on laptop (1366x768)
3. Test on tablet (768x1024)
4. Test on mobile (375x667)
5. Check voice controls visibility

**Expected Results**:
- [ ] Voice toggle visible on all screen sizes
- [ ] Gender selector accessible on all sizes
- [ ] Audio visualizer fits within screen
- [ ] No horizontal scrolling
- [ ] No overlapping elements
- [ ] Touch-friendly on mobile
- [ ] All buttons clickable

---

### 11. Accessibility Test
**Steps**:
1. Use keyboard to navigate (Tab key)
2. Use screen reader (if available)
3. Check color contrast
4. Test with high contrast mode

**Expected Results**:
- [ ] All voice controls keyboard accessible
- [ ] Voice toggle can be focused
- [ ] Gender selector can be opened with keyboard
- [ ] Aria labels present on all buttons
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader announces button states
- [ ] Focus indicators visible

---

### 12. Performance Test
**Steps**:
1. Open browser DevTools (F12)
2. Go to Performance tab
3. Record while sending voice message
4. Analyze results
5. Check Network tab for WebSocket
6. Check Console for warnings

**Expected Results**:
- [ ] No JavaScript errors in console
- [ ] WebSocket connects within 1 second
- [ ] Audio starts playing within 2 seconds of response
- [ ] CPU usage < 50% during playback
- [ ] Memory usage stable (no leaks)
- [ ] Frame rate > 30 FPS for visualizer
- [ ] Network latency < 500ms total

---

## 📊 Backend Integration Tests

### 13. Voice Stats API Test
**Steps**:
1. Open browser DevTools Network tab
2. Enable voice
3. Send message
4. Look for `/api/v1/voice/stats` call
5. Check response

**Expected Results**:
- [ ] API call made after voice enabled
- [ ] Response includes: total_characters, total_requests, total_cost
- [ ] Response includes: today_characters, today_requests, today_cost
- [ ] Response includes: limit, remaining
- [ ] Response format is valid JSON
- [ ] No 500 or 400 errors
- [ ] Response time < 1 second

---

### 14. WebSocket Connection Test
**Steps**:
1. Open browser DevTools Network tab
2. Filter by WS (WebSocket)
3. Enable voice
4. Send message
5. Observe WebSocket frames

**Expected Results**:
- [ ] WebSocket connects successfully
- [ ] WebSocket URL: `wss://api.epibraingenius.com/api/v1/voice/stream`
- [ ] WebSocket has token parameter
- [ ] Message sent: `{type: 'tts', text: '...', mode: '...', voice_model: '...'}`
- [ ] Message received: `{type: 'audio', audio: 'base64...'}`
- [ ] WebSocket stays open
- [ ] No connection drops

---

## 🎯 Voice Quality Tests

### 15. Voice Clarity Test
**Steps**:
1. Test with headphones
2. Test with speakers
3. Test at low volume
4. Test at high volume

**Expected Results**:
- [ ] Voice is clear and understandable
- [ ] No background noise or static
- [ ] Voice volume is appropriate (not too loud/quiet)
- [ ] Voice sounds natural
- [ ] No robotic or distorted sound
- [ ] Pronunciation is correct
- [ ] Pacing is natural

---

### 16. Voice Emotion Test
**Steps**:
1. Test "Personal Friend" mode (friendly, casual)
2. Test "Sales Agent" mode (confident, professional)
3. Test "Christian Companion" mode (warm, caring)
4. Test "Business Mentor" mode (authoritative)

**Expected Results**:
- [ ] Voice matches personality mood
- [ ] "Personal Friend" sounds friendly
- [ ] "Sales Agent" sounds confident
- [ ] "Christian Companion" sounds caring
- [ ] "Business Mentor" sounds professional
- [ ] Voice tone is consistent
- [ ] No inappropriate emotions

---

## 📝 User Experience Tests

### 17. First-Time User Test
**Steps**:
1. Logout of account
2. Login as new user (or different account)
3. Observe default state
4. Try voice feature

**Expected Results**:
- [ ] Voice toggle shows "Voice Off" by default
- [ ] Gender defaults to "Male"
- [ ] No errors on first login
- [ ] Voice stats show correctly
- [ ] User can enable voice easily
- [ ] On-screen guidance (if any) is clear
- [ ] No confusion about how to use

---

### 18. Repeated Use Test
**Steps**:
1. Enable voice and send 5 messages
2. Refresh page
3. Check voice state
4. Send another message
5. Check voice still works

**Expected Results**:
- [ ] Voice state resets after refresh (Phase 1 behavior)
- [ ] User can re-enable voice easily
- [ ] No errors after refresh
- [ ] Voice works consistently
- [ ] No memory leaks after many messages
- [ ] Performance doesn't degrade

---

## 🐛 Known Issues (Phase 1 Limitations)

These are expected behaviors in Phase 1:
- Voice preferences NOT saved (resets after page refresh)
- No voice speed control
- No volume control (except mute)
- No voice history/replay
- No voice export/download
- No voice-to-voice conversations
- Multi-language not supported
- Student Tutor mode disabled

---

## ✅ Test Results Summary

### Passed Tests: ___/18
### Failed Tests: ___/18
### Issues Found: ___

### Issues to Report:
1. [Issue 1]
2. [Issue 2]
3. [Issue 3]

### Recommendations:
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

---

## 🚀 Next Steps After Testing

### If All Tests Pass:
1. ✅ Mark Phase 1 as production-ready
2. ✅ Collect user feedback for 1-2 weeks
3. ✅ Monitor voice usage and costs
4. ✅ Start Phase 2.1 (Voice Settings)

### If Issues Found:
1. ⚠️ Document all issues
2. ⚠️ Prioritize by severity
3. ⚠️ Fix critical issues immediately
4. ⚠️ Deploy fixes to production
5. ⚠️ Retest after fixes

---

## 📞 Support Contact

If you encounter issues during testing:
- Check browser console for errors
- Check Vercel deployment logs
- Check backend logs (via admin panel)
- Document issue with screenshots/video
- Report to development team

---

## 🎉 Testing Completion Checklist

- [ ] All core functionality tests passed
- [ ] All error handling tests passed
- [ ] All UI/UX tests passed
- [ ] All backend integration tests passed
- [ ] All voice quality tests passed
- [ ] All user experience tests passed
- [ ] Test results documented
- [ ] Issues reported (if any)
- [ ] Recommendations documented
- [ ] Ready for Phase 2 planning

**Testing Date**: ___________
**Tester**: ___________
**Environment**: Production (https://epibraingenius.com)
**Browser**: ___________
**Device**: ___________
**Result**: ✅ PASS / ❌ FAIL
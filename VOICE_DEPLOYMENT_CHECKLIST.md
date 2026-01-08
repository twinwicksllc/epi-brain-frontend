# Voice Feature Deployment Checklist

## Pre-Deployment Checklist

### 1. Code Review
- [x] All voice components created and tested
- [x] Dashboard integration complete
- [x] Error handling implemented
- [x] TypeScript types defined
- [ ] Code reviewed for bugs
- [ ] Performance tested

### 2. Dependencies
- [x] partysocket installed
- [ ] package.json updated in Git
- [ ] Dependencies tested locally

### 3. Environment Variables
- [ ] NEXT_PUBLIC_API_URL set to production backend URL
- [ ] Deepgram API key configured in backend
- [ ] Voice limits configured in backend

### 4. Backend Verification
- [ ] Voice API endpoints deployed and working
- [ ] WebSocket endpoint accessible
- [ ] Voice stats endpoint returning data
- [ ] Voice tracking database tables created

### 5. Frontend Testing
- [ ] Voice toggle works
- [ ] Gender selector works
- [ ] Audio plays correctly
- [ ] Visualizer displays
- [ ] Mute/unmute works
- [ ] Error messages show
- [ ] Disabled modes handled
- [ ] Voice stats display
- [ ] Responsive design verified

## Deployment Steps

### Step 1: Commit Changes
```bash
cd epi-brain-frontend
git add .
git commit -m "Phase 1: Frontend voice integration complete

- Added voice infrastructure (WebSocket, Audio, VoiceManager)
- Created voice UI components (Toggle, GenderSelector, Visualizer)
- Integrated voice controls into dashboard header
- Added audio visualization to message area
- Implemented voice playback for AI responses
- Added voice stats tracking display
- Installed partysocket for WebSocket support

Components created:
- lib/voice/websocketClient.ts
- lib/voice/audioPlayer.ts
- lib/voice/voiceManager.ts
- lib/voice/types.ts
- lib/api/voiceApi.ts
- components/VoiceToggle.tsx
- components/GenderSelector.tsx
- components/AudioVisualizer.tsx
- components/voice/index.ts

Modified:
- app/dashboard/page.tsx (integrated voice features)
- package.json (added partysocket)"
```

### Step 2: Push to GitHub
```bash
git push origin main
```

### Step 3: Vercel Auto-Deploy
- [ ] Vercel detects push
- [ ] Build starts automatically
- [ ] Build completes successfully
- [ ] Deployment to production

### Step 4: Post-Deployment Testing
- [ ] Access production site
- [ ] Login to account
- [ ] Test voice toggle
- [ ] Test gender selection
- [ ] Send message and hear voice
- [ ] Check voice stats
- [ ] Test error handling
- [ ] Test disabled modes
- [ ] Test on mobile device

### Step 5: Monitor Logs
- [ ] Check Vercel deployment logs
- [ ] Monitor browser console for errors
- [ ] Check backend logs for voice requests
- [ ] Verify Deepgram API calls

## Rollback Plan

If issues occur:
```bash
# Rollback to previous commit
git revert HEAD
git push origin main
```

Or use Vercel rollback feature:
- Go to Vercel dashboard
- Select deployment
- Click "Rollback"

## Production URLs

- **Frontend**: https://epibraingenius.com
- **Backend**: https://api.epibraingenius.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Project**: epi-brain-frontend

## Monitoring

After deployment, monitor:
- Voice usage statistics
- Deepgram API costs
- Error rates
- User feedback
- Performance metrics

## Success Criteria

Deployment is successful if:
- ✅ Site loads without errors
- ✅ Voice controls appear in header
- ✅ Voice can be toggled on/off
- ✅ Audio plays for AI responses
- ✅ Voice stats display correctly
- ✅ No console errors
- ✅ Works on desktop and mobile
- ✅ Backend voice endpoints respond
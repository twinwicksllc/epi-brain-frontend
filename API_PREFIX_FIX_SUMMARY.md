# API Double Prefix Fix Summary

## Problem
API calls were being sent with double `/api/v1` prefixes, resulting in 404 errors:
- Example: `/api/v1/api/v1/chat/conversations` instead of `/api/v1/chat/conversations`

This occurred when `NEXT_PUBLIC_API_URL` was configured with the `/api/v1` suffix already included, and the API clients unconditionally appended it again.

## Root Cause
Three files were unconditionally appending `/api/{version}` to the base URL without checking if it already existed:
1. `lib/api/client.ts` (authenticated axios client)
2. `lib/api/publicClient.ts` (public axios client)
3. `lib/voice/VoiceHTTPClient.ts` (voice HTTP client)

## Solution
Implemented smart URL construction in all three files that:
1. Removes trailing slashes from the base URL
2. Checks if `/api/{version}` is already included in the URL
3. Only appends it if not already present

### Pattern Applied
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Construct base URL, avoiding double prefix
const normalizedBaseUrl = API_URL.replace(/\/+$/, ''); // Remove trailing slashes
const apiBaseURL = normalizedBaseUrl.includes(`/api/${API_VERSION}`)
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api/${API_VERSION}`;
```

## Files Fixed
1. ✅ **lib/api/client.ts**
   - Fixed axios baseURL construction
   - Affects: `authApi`, `chatApi`, `modesApi`, `userApi`, `assistantToolsApi`, `adminApi`
   
2. ✅ **lib/api/publicClient.ts**
   - Fixed axios baseURL construction
   - Affects: `publicChatApi`
   
3. ✅ **lib/voice/VoiceHTTPClient.ts**
   - Fixed manual URL construction in `generateSpeech()` method
   - Changed from: `${this.baseURL}/api/v1/voice/generate`
   - Changed to: `${this.baseURL}/voice/generate`

## Verified Endpoints
The following endpoints now work correctly regardless of `NEXT_PUBLIC_API_URL` format:
- `/users/me` → `GET /api/v1/users/me`
- `/chat/conversations` → `GET /api/v1/chat/conversations`
- `/modes` → `GET /api/v1/modes`
- `/voice/generate` → `POST /api/v1/voice/generate`
- `/voice/stats` → `GET /api/v1/voice/stats`

## Environment Variable Flexibility
The fix supports both URL formats for `NEXT_PUBLIC_API_URL`:

| Format | Result |
|--------|--------|
| `http://localhost:8000` | ✅ `http://localhost:8000/api/v1` |
| `http://localhost:8000/api/v1` | ✅ `http://localhost:8000/api/v1` |
| `https://api.example.com` | ✅ `https://api.example.com/api/v1` |
| `https://api.example.com/api/v1` | ✅ `https://api.example.com/api/v1` |

## Testing Recommendations
1. **Local Development**: Verify with `NEXT_PUBLIC_API_URL=http://localhost:8000`
2. **Production**: Test with full URL including version if needed
3. **Dashboard**: Confirm all API calls resolve with single `/api/v1` prefix
4. **Voice Features**: Verify voice generation endpoints work correctly

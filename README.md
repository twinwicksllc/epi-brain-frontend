# EPI Brain Frontend

Next.js-based frontend for EPI Brain - An AI-powered conversational platform with 9 distinct personality modes.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui, Radix UI
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **API Client:** Axios
- **Real-time:** Socket.io-client
- **Authentication:** Clerk / NextAuth.js
- **Analytics:** Mixpanel, Google Analytics

## 📁 Project Structure

```
epi-brain-frontend/
├── app/
│   ├── (auth)/                 # Authentication routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── dashboard/
│   │   │   ├── page.tsx        # Main chat interface
│   │   │   ├── history/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── billing/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── admin/                  # Admin dashboard (Enterprise)
│   │   ├── page.tsx
│   │   ├── users/
│   │   ├── analytics/
│   │   └── grading/
│   ├── pricing/
│   │   └── page.tsx
│   ├── enterprise/
│   │   └── page.tsx
│   ├── api/                    # API routes
│   │   └── webhooks/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── chat/                   # Chat-specific components
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ChatInput.tsx
│   │   └── VoiceControls.tsx
│   ├── modes/                  # Mode selector components
│   │   ├── ModeSelector.tsx
│   │   ├── ModeCard.tsx
│   │   └── ModeIcon.tsx
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── shared/                 # Shared components
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── lib/
│   ├── api.ts                  # API client configuration
│   ├── utils.ts                # Utility functions
│   ├── constants.ts            # App constants
│   └── hooks/                  # Custom React hooks
│       ├── useChat.ts
│       ├── useVoice.ts
│       └── useAuth.ts
├── store/                      # Zustand stores
│   ├── chatStore.ts
│   ├── userStore.ts
│   └── modeStore.ts
├── types/                      # TypeScript types
│   ├── chat.ts
│   ├── user.ts
│   └── mode.ts
├── public/
│   ├── images/
│   └── icons/
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js 20+
- npm or yarn or pnpm

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/twinwicksllc/epi-brain-frontend.git
   cd epi-brain-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   - Navigate to http://localhost:3000

## 🔑 Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Analytics
NEXT_PUBLIC_MIXPANEL_TOKEN=...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...

# Feature Flags
NEXT_PUBLIC_ENABLE_VOICE=true
NEXT_PUBLIC_ENABLE_REFERRALS=true

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
```

## 🎨 Design System

### Color Palette (Personality Modes)

```typescript
const modeColors = {
  personalFriend: '#3B82F6',    // Blue
  salesAgent: '#F59E0B',        // Amber
  studentTutor: '#10B981',      // Emerald
  kidsLearning: '#EC4899',      // Pink
  christianCompanion: '#8B5CF6', // Violet
  customerService: '#6366F1',   // Indigo
  psychologyExpert: '#14B8A6',  // Teal
  businessMentor: '#64748B',    // Slate
  weightLossCoach: '#EF4444',   // Red
};
```

### Typography

- **Headings:** Inter (font-sans)
- **Body:** Inter (font-sans)
- **Code:** Fira Code (font-mono)

## 📱 Pages & Routes

### Public Routes
- `/` - Landing page
- `/pricing` - Pricing tiers
- `/enterprise` - Enterprise landing page
- `/login` - User login
- `/register` - User registration

### Protected Routes (Authenticated)
- `/dashboard` - Main chat interface
- `/dashboard/history` - Conversation history
- `/dashboard/settings` - User settings
- `/dashboard/billing` - Subscription management

### Admin Routes (Enterprise)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/analytics` - Usage analytics
- `/admin/grading` - Grading system

## 🧩 Key Components

### ChatInterface
Main chat component with real-time messaging, mode switching, and voice controls.

```typescript
<ChatInterface
  conversationId={id}
  mode={currentMode}
  onModeChange={handleModeChange}
  enableVoice={true}
/>
```

### ModeSelector
Dropdown to switch between personality modes.

```typescript
<ModeSelector
  currentMode={mode}
  availableModes={modes}
  onSelect={handleModeSelect}
  tier={userTier}
/>
```

### VoiceControls
Voice input/output controls.

```typescript
<VoiceControls
  isRecording={recording}
  onStartRecording={handleStart}
  onStopRecording={handleStop}
  voicePreference={preference}
/>
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests (Playwright)
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel:**
   - Go to vercel.com
   - Import Git repository
   - Configure environment variables

2. **Deploy:**
   ```bash
   vercel --prod
   ```

### Docker

```bash
# Build
docker build -t epi-brain-frontend:latest .

# Run
docker run -p 3000:3000 epi-brain-frontend:latest
```

## 📊 Performance Targets

- **Lighthouse Score:** 90+
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1

## 🎯 Features

### Core Features
- ✅ Real-time chat interface
- ✅ 9 personality mode switching
- ✅ Voice input/output
- ✅ Conversation history
- ✅ User authentication
- ✅ Subscription management

### Pro Features
- ✅ Unlimited messages
- ✅ All personality modes
- ✅ Voice features
- ✅ Export conversations to PDF
- ✅ Priority support

### Enterprise Features
- ✅ Admin dashboard
- ✅ User management
- ✅ Analytics and reporting
- ✅ Grading system
- ✅ White-label options
- ✅ SSO integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 📞 Contact

- **Project Owner:** Darrick Bynum
- **Company:** RankedCEO / TwinWicks LLC
- **Phone:** 630-202-7977

---

**Status:** 🚧 In Development

**Version:** 0.1.0

**Last Updated:** December 2024
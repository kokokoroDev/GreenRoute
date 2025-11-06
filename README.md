# 🌱 Eco Routes Reward - GreenRoutes

**Transform your sustainable transport choices into rewards!** 

Eco Routes Reward is a gamified mobile web application that incentivizes eco-friendly transportation by rewarding users with EcoMiles for walking, cycling, and using e-scooters. Built with modern web technologies and integrated with Hedera Hashgraph for blockchain rewards.

## 🚀 Features

### 🎯 Core Functionality
- **Trip Tracking**: GPS-based tracking for walking, cycling, and e-scooter trips
- **EcoMiles Rewards**: Earn points based on distance, mode, and environmental impact
- **CO₂ Savings**: Track and display your environmental impact
- **Streak System**: Daily activity streaks with bonus multipliers
- **Achievement Badges**: Unlock badges for milestones and challenges
- **Leaderboard**: Compete with other users for top eco-friendly rankings

### 🎮 Gamification
- **Multiplier System**: Different transport modes have different reward multipliers
  - Walking: 1.5x multiplier
  - Cycling: 1.2x multiplier  
  - E-scooter: 1.0x multiplier
- **Weekly Streaks**: Complete 7 days for streak bonus multipliers
- **Badge System**: Unlock achievements like "CO₂ Champion", "Distance Master", etc.
- **Real-time Progress**: Live tracking of your environmental impact

### 🔐 Authentication & Demo
- **Demo Mode**: Full app experience without registration
- **Mock Authentication**: Simulated login/signup for demonstration
- **Profile Management**: User profiles with statistics and achievements
- **localStorage Persistence**: Demo state persists across browser sessions

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components
- **Radix UI** - Headless UI primitives
- **Lucide React** - Beautiful icons

### Data Management
- **React State** - Client-side state management with Context API
- **localStorage** - Demo mode persistence and user preferences
- **In-memory Storage** - All data stored in browser memory for demo purposes

### State Management & Data Fetching
- **React Context** - Global application state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **TanStack Query** - Available for future server state management

### Future Blockchain Integration
- **Hedera Hashgraph** - Planned distributed ledger for rewards
- **HCS (Hedera Consensus Service)** - Future immutable trip records

## 📱 Pages & Features

### 🏠 Landing Page
- Hero section with app introduction
- Demo mode access
- Feature highlights
- Call-to-action for new users

### 🔐 Authentication
- User registration and login
- Email verification
- Password reset functionality
- Demo mode toggle

### 📊 Dashboard
- **Quick Stats**: CO₂ saved, EcoMiles balance, current streak
- **Trip Actions**: Start new trips with different transport modes
- **Progress Tracking**: Weekly streak and next achievement progress
- **Recent Activity**: Latest trip history
- **Quick Actions**: Access to leaderboard and badges

### 🚶‍♂️ Trip Tracking
- **Mode Selection**: Choose walking, cycling, or e-scooter
- **GPS Tracking**: Real-time location tracking (demo mode)
- **Live Stats**: Distance, duration, speed, CO₂ saved
- **Trip Management**: Start, pause, and end trips
- **Route Visualization**: GPS route mapping
- **Future Blockchain**: Hedera HCS integration for immutable records

### 🏆 Leaderboard
- **Global Rankings**: Top users by CO₂ saved
- **User Profiles**: Individual statistics and achievements
- **Filtering**: Sort by different metrics
- **Real-time Updates**: Live leaderboard updates

### 🎖️ Badges & Achievements
- **Badge Collection**: View earned and available badges
- **Progress Tracking**: Progress towards next achievements
- **Categories**: Distance, CO₂, streaks, and special challenges
- **Unlock Conditions**: Clear requirements for each badge

### 👤 Profile
- **Personal Stats**: Comprehensive user statistics
- **Trip History**: Complete trip log with details
- **Achievements**: All earned badges and progress
- **Settings**: Account management and preferences

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser with GPS support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eco-routes-reward
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup** (Optional - for future blockchain integration)
   Create a `.env` file in the root directory when Hedera integration is implemented:
   ```env
   VITE_HEDERA_NETWORK=testnet
   VITE_HEDERA_ACCOUNT_ID=your_hedera_account_id
   VITE_HEDERA_PRIVATE_KEY=your_hedera_private_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   └── Navigation.tsx   # Main navigation component
│   └── Protected.tsx   # Protected navigation component
├── contexts/            # React contexts
│   └── AppContext.tsx   # Global app state
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client (for future use)
├── lib/                 # Utility functions
├── pages/               # Page components
│   ├── Auth.tsx         # Authentication page
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Trip.tsx         # Trip tracking
│   ├── Leaderboard.tsx  # User rankings
│   ├── Badges.tsx       # Achievements
│   ├── Profile.tsx      # User profile
│   └── Landing.tsx      # Landing page
├── assets/              # Static assets
└── App.tsx              # Main app component
```

## 🎨 Design System

### Color Palette
- **Primary**: Green tones for eco-friendly theme
- **Secondary**: Complementary colors for UI elements
- **Success**: Green for positive actions and CO₂ savings
- **Warning**: Orange for streaks and achievements
- **Destructive**: Red for errors and rejected trips

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable text
- **Code**: Monospace for technical content

### Components
- **Cards**: Elevated surfaces for content grouping
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Badges**: Status indicators and achievements
- **Progress**: Visual progress indicators
- **Forms**: Consistent form styling with validation

## 🔧 Configuration

### Demo Mode Setup
1. The app runs in demo mode by default
2. Demo data is automatically loaded when you start the app
3. Demo state persists in localStorage across browser sessions
4. No external services required for basic functionality

### Hedera Integration (Planned Future Feature)
1. Create a Hedera account
2. Get your account ID and private key
3. Set up HCS topics for immutable trip records
4. Configure environment variables
5. Implement blockchain reward distribution

## 📱 Mobile Optimization

- **Responsive Design**: Optimized for mobile devices
- **PWA Ready**: Can be installed as a mobile app
- **Touch-Friendly**: Large touch targets and gestures
- **Offline Support**: Basic offline functionality
- **GPS Integration**: Native GPS tracking capabilities

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests (when implemented)
npm run test
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `dist` folder to your hosting provider
3. Configure environment variables on your server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## 🙏 Acknowledgments

- **Hedera Hashgraph** for planned blockchain infrastructure integration
- **Shadcn/ui** for the beautiful component library
- **Vite** for the fast development experience
- **React** team for the excellent framework
- **Tailwind CSS** for the utility-first styling approach

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic trip tracking (demo mode)
- ✅ EcoMiles rewards system
- ✅ Mock authentication and demo mode
- ✅ Dashboard and profile
- ✅ Client-side data management

### Phase 2 (Next)
- 🔄 Real database integration (Supabase/PostgreSQL)
- 🔄 Real user authentication
- 🔄 Social features and challenges
- 🔄 Team competitions
- 🔄 Advanced analytics
- 🔄 Mobile app (React Native)

### Phase 3 (Future)
- 📋 Hedera Hashgraph blockchain integration
- 📋 Immutable trip records via HCS
- 📋 Integration with public transport
- 📋 Corporate partnerships
- 📋 Carbon offset marketplace
- 📋 Advanced gamification features

---

**Made with ❤️ for a greener future** 🌍

# SkillSwap - Peer-to-Peer Learning Platform

![SkillSwap](https://img.shields.io/badge/SkillSwap-Learning%20Platform-blue)
![React](https://img.shields.io/badge/React-18.x-blue)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-blue)

A modern peer-to-peer learning platform where students exchange skills instead of money. Teach what you know, learn what you want!

## Features

### Core Features
- **Authentication**: Email/Password and Google OAuth signup/login
- **User Profiles**: Complete profiles with bio, skills, ratings, and badges
- **Skill Discovery**: Search and browse teachers with advanced filtering
- **Booking System**: Easy session scheduling with date/time picker
- **Skill Points Economy**: Earn points by teaching, spend points to learn
- **Real-time Chat**: Firebase Realtime Database powered messaging
- **Video Calls**: Integrated Jitsi Meet for free video sessions
- **Reviews & Ratings**: 5-star rating system with written reviews
- **Session Management**: Track upcoming and past sessions
- **Responsive Design**: Mobile-first, works perfectly on all devices
- **Dark Mode**: Full dark mode support
- **Notifications**: Toast notifications for all actions

### Additional Features
- Badge system (Beginner, Pro, Expert teacher badges)
- Transaction history
- User dashboard with analytics
- Email verification
- Secure Firebase security rules
- FAQ and Help pages

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase
  - Authentication (Email/Password + Google OAuth)
  - Firestore (Database)
  - Realtime Database (Chat)
  - Storage (Profile Pictures)
- **Routing**: React Router DOM
- **Notifications**: React Toastify
- **Icons**: React Icons
- **Date Picker**: React DatePicker
- **Video Calls**: Jitsi Meet (embedded)
- **Deployment**: Firebase Hosting

## Project Structure

```
skillswap/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── common/
│   │   │   └── ProtectedRoute.jsx
│   │   └── layout/
│   │       └── Navbar.jsx
│   ├── config/
│   │   └── firebase.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Discover.jsx
│   │   ├── FAQ.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Messages.jsx
│   │   ├── MySessions.jsx
│   │   ├── Profile.jsx
│   │   ├── Signup.jsx
│   │   └── TeacherProfile.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .firebaserc
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── database.rules.json
├── storage.rules
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Vercel account (for deployment)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd skillswap
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow the setup wizard

#### Enable Authentication
1. In Firebase Console, go to Authentication
2. Click "Get Started"
3. Enable Email/Password provider
4. Enable Google provider

#### Create Firestore Database
1. Go to Firestore Database
2. Click "Create Database"
3. Start in **production mode**
4. Choose a location

#### Create Realtime Database
1. Go to Realtime Database
2. Click "Create Database"
3. Start in **locked mode**
4. Choose a location

#### Enable Storage
1. Go to Storage
2. Click "Get Started"
3. Start in **production mode**

#### Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app
5. Copy the config object

### 4. Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Firebase credentials in `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
```

### 5. Deploy Security Rules

#### Firestore Rules
1. In Firebase Console, go to Firestore Database → Rules
2. Copy contents from `firestore.rules`
3. Publish the rules

#### Realtime Database Rules
1. Go to Realtime Database → Rules
2. Copy contents from `database.rules.json`
3. Publish the rules

#### Storage Rules
1. Go to Storage → Rules
2. Copy contents from `storage.rules`
3. Publish the rules

### 6. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 7. Build for Production

```bash
npm run build
```

## Deployment to Firebase Hosting

Firebase Hosting is perfect for SkillSwap since everything (backend + hosting) is in one place!

### Prerequisites

1. Firebase CLI installed (already done if you ran setup)
2. Your Firebase project configured (`skillswap-19321`)
3. All Firebase services enabled (Authentication, Firestore, Realtime DB, Storage)

### Deploy Steps

1. **Login to Firebase**:
```bash
firebase login
```

2. **Deploy Security Rules** (one-time setup):
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Realtime Database rules
firebase deploy --only database

# Deploy Storage rules
firebase deploy --only storage
```

3. **Build your app**:
```bash
npm run build
```

4. **Deploy to Firebase Hosting**:
```bash
firebase deploy --only hosting
```

5. **Your app is live!**
   - Firebase will provide a URL like: `https://skillswap-19321.web.app`
   - Or your custom domain if configured

### Quick Deploy (All at Once)

Deploy everything (hosting + all rules):
```bash
npm run build && firebase deploy
```

### Update Deployment

To update your live app after making changes:
```bash
npm run build
firebase deploy --only hosting
```

### View Your Live App

```bash
firebase hosting:channel:deploy preview  # Preview channel
firebase open hosting:site               # Open in browser
```

### Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the instructions to verify and connect your domain

### Environment Variables

Firebase Hosting automatically uses the `.env` variables during build. Your credentials are already configured in `.env` (not committed to Git).

For production-specific variables, create `.env.production`:
```env
# Same as .env but for production
VITE_FIREBASE_API_KEY=your_key_here
# ... other variables
```

## Demo Credentials

For testing purposes, you can use:
- Email: `demo@skillswap.com`
- Password: `demo123456`

Or create a new account to explore all features!

## Usage Guide

### For New Users

1. **Sign Up**: Create an account with email or Google
2. **Complete Profile**: Add your name, bio, university
3. **Add Skills**:
   - Skills you can teach (with proficiency levels)
   - Skills you want to learn
4. **Get Started**: You'll receive 50 bonus Skill Points!

### Learning a New Skill

1. Go to **Discover** page
2. Use filters to find teachers
3. Click on a teacher's profile
4. Click **Book a Session**
5. Select skill, date, and time
6. Confirm booking (costs 10 SP)
7. Teacher will accept/decline
8. Join video call when it's time
9. Mark session complete
10. Leave a review

### Teaching a Skill

1. Add skills to your profile
2. Wait for booking requests
3. Accept or decline requests
4. Join video call at scheduled time
5. Mark session complete
6. Earn 10 Skill Points!

## Skill Points System

- **New User Bonus**: 50 SP
- **Earn**: 10 SP per session taught
- **Spend**: 10 SP per session booked
- **Balance**: Track in navbar and dashboard

## Badge System

- **Beginner Teacher** 🌱: 5 sessions taught
- **Pro Teacher** ⭐: 20 sessions taught
- **Expert Teacher** 👑: 50 sessions taught

## Features in Detail

### Video Calls
Sessions use Jitsi Meet, a free and secure video conferencing solution. No additional setup required!

### Real-time Chat
Message any user directly. Perfect for coordinating sessions or asking questions before booking.

### Dark Mode
Toggle between light and dark themes. Preference is saved automatically.

### Responsive Design
Optimized for mobile, tablet, and desktop. Works seamlessly on all screen sizes.

## Troubleshooting

### Firebase Connection Issues
- Check your `.env` file has correct credentials
- Ensure all Firebase services are enabled
- Verify security rules are deployed

### Build Errors
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node --version` (should be 16+)

### Deployment Issues
- Verify environment variables in Vercel
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or building your own version!

## Support

For issues or questions:
- Open an issue on GitHub
- Email: support@skillswap.com

## Acknowledgments

- Built with React and Firebase
- UI components styled with Tailwind CSS
- Icons from React Icons
- Video calls powered by Jitsi Meet

---

Made with ❤️ for students, by students. Happy learning and teaching!

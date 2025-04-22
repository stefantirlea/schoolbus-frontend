# SchoolBus Frontend

This repository contains the frontend React application for the SchoolBus Management Platform, which provides a user interface for managing schools, students, and transportation routes.

## Technology Stack

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool
- **React Router**: Navigation
- **Material UI**: Component library
- **Firebase Auth**: Authentication
- **Axios**: API requests

## Local Development

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Firebase project (for authentication)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ScopeSystemsSoftware/schoolbus-frontend.git
   cd schoolbus-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Features

- **Authentication**: Login, registration, and protected routes
- **School Management**: List, view, create, edit, and delete schools
- **Dashboard**: Overview of key metrics and data
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Architecture

The frontend application follows a clean architecture pattern:

- **Components**: Reusable UI components
- **Pages**: Route-specific page components
- **Contexts**: State management using React Context API
- **Services**: API services and data fetching logic
- **Utils**: Utility functions and helpers

## API Integration

The frontend connects to the SchoolBus backend microservices through API endpoints. All API requests are authenticated using Firebase ID tokens.

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Deployment

This application can be deployed to various hosting platforms:

- **Firebase Hosting** (recommended)
- **Vercel**
- **Netlify**
- **Google Cloud Run**

## Contribution Guidelines

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request

Please follow the established code style and add tests for new features. 
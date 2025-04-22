import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdToken
} from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthService, User as AppUser } from '../services/authService';

// Interface for the context value
interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  register: (email: string, password: string) => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  refreshUserProfile: () => Promise<AppUser | null>;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = useAuthService();

  // Log in with email and password
  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // After Firebase login, get token and call backend auth endpoint
    try {
      const idToken = await getIdToken(userCredential.user);
      const response = await authService.firebaseLogin(idToken);
      setUserProfile(response.data.user);
    } catch (error) {
      console.error('Error authenticating with backend:', error);
    }
    return userCredential.user;
  };

  // Register with email and password
  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // After Firebase register, get token and call backend auth endpoint
    try {
      const idToken = await getIdToken(userCredential.user);
      const response = await authService.firebaseLogin(idToken);
      setUserProfile(response.data.user);
    } catch (error) {
      console.error('Error registering with backend:', error);
    }
    return userCredential.user;
  };

  // Sign out
  const signOut = async () => {
    setUserProfile(null);
    return firebaseSignOut(auth);
  };

  // Get ID token for API calls
  const getToken = async () => {
    if (!currentUser) return null;
    return await getIdToken(currentUser, true);
  };

  // Refresh user profile from backend
  const refreshUserProfile = async () => {
    if (!currentUser) return null;
    
    try {
      const token = await getToken();
      
      if (token) {
        // First try to authenticate with Firebase token if no profile exists
        if (!userProfile) {
          try {
            const authResponse = await authService.firebaseLogin(token);
            setUserProfile(authResponse.data.user);
            return authResponse.data.user;
          } catch (error) {
            console.error('Error authenticating with Firebase token:', error);
          }
        }
        
        // Then try to get profile directly
        try {
          const profileResponse = await authService.getProfile();
          setUserProfile(profileResponse);
          return profileResponse;
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
    
    return null;
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Try to get the user profile when Firebase auth state changes
        try {
          await refreshUserProfile();
        } catch (error) {
          console.error('Error refreshing user profile on auth state change:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    // Cleanup the listener on unmount
    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    signOut,
    getToken,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
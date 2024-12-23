import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from "../Keys/FirebaseConfig"; // import your Firebase config

// Type definitions for the context
interface AuthContextType {
  user: User | null;  // User object or null if not signed in
  loading: boolean;   // Boolean indicating whether Firebase is checking auth state
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component to wrap the app with authentication context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);  // Update the user state when auth state changes
      setLoading(false);     // Set loading to false once the auth state is determined
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}  {/* All child components can access this context */}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth state
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

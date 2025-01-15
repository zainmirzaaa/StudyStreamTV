import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of the user object
interface User {
  username: string;
  email: string;
  categoriesWatched: string[];
  description: string;
  followers: string[];
  following: string[];
  hoursWatched: number[];
  links: string[];
  pastStreams: string[];
  previousWatchedStreams: string[];
}

// Define the context value type
interface UserContextType {
  user: User | null;
  updateUser: (newUserData: User) => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to access the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (newUserData: User): void => {
    setUser(newUserData); // Update the user context
    console.log('User data set:', newUserData);
  };

  // Log whenever the user state changes
  useEffect(() => {
    console.log('User state updated in UserProvider:', user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of the user object (you can adjust this type according to your API response)
interface User {
  username: string;
  email: string;
  categoriesWatched: string[]; // Array of categories the user has watched
  description: string;
  followers: string[]; // Array of usernames who follow the user
  following: string[]; // Array of usernames that the user is following
  hoursWatched: number[]; // Array of numbers representing hours watched (perhaps by category or stream)
  links: string[]; // Array of links (URLs)
  pastStreams: string[]; // Array of past streams
  previousWatchedStreams: string[]; // Array of previously watched streams
}

// Define the context value type
interface UserContextType {
  user: User | null;
  updateUser: (newUserData: User) => void;
}

// Create the context with a default value of null for user and a placeholder function for updateUser
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to access the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserContext Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (newUserData: User): void => {
    setUser(newUserData);  // Set the user data in the context
    console.log("User data set:", newUserData);
    
  };

  // Use useEffect to log user whenever it changes
  useEffect(() => {
    if (user) {
      console.log("User state updated:", user);
    }
  }, [user]); // This effect will run whenever 'user' changes
  
  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

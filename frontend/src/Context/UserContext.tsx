import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the user object (you can adjust this type according to your API response)
interface User {
  username: string;
  email: string;
  // Add other properties based on the actual user data
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
    console.log(newUserData);  // Optionally log the updated user data
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

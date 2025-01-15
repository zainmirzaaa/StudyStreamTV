import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for page navigation
import { signOutUser } from '../API/Authentication'; // Import the signOutUser function
import NavBar from './Navbar';
import { useAuth } from '../Context/AuthContext';
import { getUsername } from '../API/Firestore';
import { getOnSignIn } from '../API/backendAPI';
import { useUser } from '../Context/UserContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth(); // Get user from AuthContext
  const { updateUser } = useUser(); // Get updateUser from UserContext
  const [username, setUsername] = useState<string>('');

  // Function to handle sign-out and navigate to the sign-in page
  const handleSignOut = async () => {
    try {
      await signOutUser(); // Log out the user
      navigate('/'); // Redirect to the sign-in page
    } catch (error) {
      console.error("Error signing out:", error); // Handle any errors during sign-out
    }
  };

  // Use useEffect to fetch username and update the context
  useEffect(() => {
    const fetchUsername = async () => {
      if (authUser?.email && !username) { // Only fetch if there's an email and username is not already set
        try {
          // Fetch the username based on email
          console.log("Fetching username for email:", authUser.email);
          const fetchedUsername = await getUsername(authUser.email);
          console.log("Fetched username:", fetchedUsername);

          // Set the username in the local state
          setUsername(fetchedUsername);

          // Fetch full user data (using the username) and update UserContext
          const userData = await getOnSignIn(fetchedUsername); // Assuming getOnSignIn returns the full user data
          console.log(userData);
          updateUser(userData); // Update UserContext with the new user data
          
        } catch (err) {
          console.error('Error fetching username:', err);
          setUsername('john_doe'); // Fallback username in case of error
        }
      } else {
        // If authUser is available but username is already set, skip fetching
        if (username) {
          console.log("Username already fetched, skipping API call.");
        }
      }
    };

    fetchUsername();
  }, [authUser, username, updateUser]); // Add `username` as a dependency to avoid continuous fetching

  return (
    <div style={styles.pageContainer}>
      <NavBar />
      <div style={styles.contentContainer}>
        <h1>Welcome, {username}!</h1>
        <button style={styles.signOutButton} onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
};

// Styles for centering the content, navbar, and button
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', // Full screen height
    backgroundColor: '#f0f4f8', // Light background color
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333', // Dark background for navbar
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000, // Keep navbar on top
  },
  contentContainer: {
    textAlign: 'center',
    marginTop: '60px', // To ensure content isn't hidden under the navbar
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  signOutButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#ff6347', // Tomato color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Home;

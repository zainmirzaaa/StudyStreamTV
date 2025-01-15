import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from '../API/Authentication';
import NavBar from './Navbar';
import { useAuth } from '../Context/AuthContext';
import { getUsername } from '../API/Firestore';
import { getOnSignIn } from '../API/backendAPI';
import { useUser } from '../Context/UserContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth(); // Access auth context
  const { user, updateUser } = useUser(); // Access user context
  const [username, setUsername] = useState<string>(''); // Local username state
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Function to handle sign-out and navigate to the sign-in page
  const handleSignOut = async () => {
    try {
      await signOutUser(); // Log out the user
      navigate('/'); // Redirect to sign-in
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Fetch username and user data
  useEffect(() => {
    const fetchUsername = async () => {
      if (authUser?.email && !username) {
        try {
          console.log('Fetching username for email:', authUser.email);
          const fetchedUsername = await getUsername(authUser.email);
          console.log('Fetched Username:', fetchedUsername);

          setUsername(fetchedUsername);

          // Fetch full user data and update context
          const userData = await getOnSignIn(fetchedUsername);
          console.log('User Data from API:', userData);

          updateUser(userData); // Update context with user data
        } catch (error) {
          console.error('Error fetching username or user data:', error);
          setUsername('john_doe'); // Fallback username
        } finally {
          setLoading(false); // Stop loading regardless of success or error
        }
      } else if (username) {
        console.log('Username already fetched, skipping API call.');
        setLoading(false);
      }
    };

    fetchUsername();
  }, [authUser, username, updateUser]);

  // Log user whenever it changes
  useEffect(() => {
    if (user) {
      console.log('User in Home component:', user);
    }
  }, [user]);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  return (
    <div style={styles.pageContainer}>
      <NavBar />
      <div style={styles.contentContainer}>
        <h1>Welcome, {username || 'Guest'}!</h1>
        {user && (
          <p>
            Logged in as: {user.username} ({user.email})
          </p>
        )}
        <button style={styles.signOutButton} onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

// Styles for centering the content, navbar, and button
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f0f4f8',
  },
  contentContainer: {
    textAlign: 'center',
    marginTop: '60px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  signOutButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#ff6347',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Home;

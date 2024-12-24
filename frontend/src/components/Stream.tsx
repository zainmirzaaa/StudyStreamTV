import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for page navigation
import { signOutUser } from '../API/Authentication'; // Import the signOutUser function

const Stream: React.FC = () => {
  const navigate = useNavigate();

  // Function to handle sign-out and navigate to the sign-in page
  const handleSignOut = async () => {
    try {
      await signOutUser(); // Log out the user
      navigate('/'); // Redirect to the sign-in page
    } catch (error) {
      console.error("Error signing out:", error); // Handle any errors during sign-out
    }
  };

  return (
    <div style={styles.pageContainer}>
      <nav style={styles.navbar}>
        <div style={styles.navLinks}>
          <a href="/profile" style={styles.navLink}>Profile</a>
          <a href="/stream" style={styles.navLink}>Stream</a>
          <a href="/watch" style={styles.navLink}>Watch</a>
        </div>
        <button onClick={handleSignOut} style={styles.signOutButton}>Logout</button>
      </nav>

        <div style={styles.welcomeMessage}>
          <h1>Welcome!</h1>
       
      </div>
    </div>
  );
};

// Styles for the page layout, navbar, and profile picture
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
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    transition: 'color 0.3s',
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
  profileContainer: {
    position: 'relative',
    textAlign: 'center',
    marginTop: '60px', // To avoid overlap with navbar
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  profilePictureContainer: {
    position: 'absolute',
    top: '-50px', // Adjust to position above the content
    right: '20px',
  },
  profilePicture: {
    width: '100px',
    height: '100px',
    borderRadius: '50%', // Circular shape
    border: '3px solid #ff6347', // Tomato border color
  },
  welcomeMessage: {
    marginTop: '60px', // To avoid overlap with profile picture
  },
};

export default Stream;

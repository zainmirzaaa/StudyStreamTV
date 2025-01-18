import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from '../API/Authentication';
import { useUser } from '../Context/UserContext';
import { useAuth } from '../Context/AuthContext';
import { getUsername } from '../API/Firestore';
import { getOnSignIn, updateDescriptionAndLinks} from '../API/backendAPI';
import NavBar from './Navbar';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { user: authAuth } = useAuth(); // Access AuthContext

  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [description, setDescription] = useState(user?.description || ''); // Description input state
  const [links, setLinks] = useState(''); // Links input state
  const [profileImage, setProfileImage] = useState(user?.profilePicture || 'https://via.placeholder.com/100'); // Profile image state

  const handleSignOut = async () => {
    try {
      await signOutUser(); // Log out the user
      navigate('/'); // Redirect to sign-in page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (authAuth?.email) {
        try {
          console.log('Fetching user data for:', authAuth.email);
          const username = await getUsername(authAuth.email);
          const userData = await getOnSignIn(username);
          setUser(userData);
          console.log('Fetched User Data:', userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
  
    fetchUserData(); // Fetch user data on mount or when authAuth?.email changes
  }, [authAuth?.email]); // Run only when authAuth?.email changes
  
  // Handle user sign-out
  

  // Handle edit submission
  const handleEditSubmit = async () => {
    console.log("pressed");
    console.log(user);
    if (user) {
      try {
        await updateDescriptionAndLinks(user.username, description, links);
        console.log("User data updated successfully");
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
    setIsEditing(false);
  };
  

  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setProfileImage(reader.result as string); // Update the profile image preview
      };

      reader.readAsDataURL(file); // Convert the image file to base64 URL
    }
  };

  return (
    <div style={styles.pageContainer}>
      <NavBar />

      <div style={styles.profileContainer}>
        <div style={styles.profilePictureContainer}>
          <img
            src={profileImage} // Display profile image
            alt="Profile"
            style={styles.profilePicture}
          />
        </div>
        <div style={styles.welcomeMessage}>
          {!isEditing ? (
            <>
              <h1>Welcome, {user ? user.username : 'Guest'}!</h1>
              {user && (
                <>
                  <p>Description: {user.description || 'No description provided'}</p>
                  <p>Links: {'No links provided'}</p>
                </>
              )}
              <button style={styles.editButton} onClick={() => setIsEditing(true)}>
                Edit
              </button>
            </>
          ) : (
            <>
              <div>
                <label>
                  Description:
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.input}
                  />
                </label>
              </div>
              <div>
                <label>
                  Links (comma-separated):
                  <input
                    type="text"
                    value={links}
                    onChange={(e) => setLinks(e.target.value)}
                    style={styles.input}
                  />
                </label>
              </div>
              <div>
                <label>
                  Profile Image:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={styles.fileInput}
                  />
                </label>
              </div>
              <div>
                <button style={styles.submitButton} onClick={handleEditSubmit}>
                  Submit
                </button>
                <button style={styles.cancelButton} onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </>
          )}
          <button style={styles.signOutButton} onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles for the page layout, navbar, and profile picture
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f0f4f8',
  },
  profileContainer: {
    position: 'relative',
    textAlign: 'center',
    marginTop: '60px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  profilePictureContainer: {
    position: 'absolute',
    top: '-50px',
    right: '20px',
  },
  profilePicture: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '3px solid #ff6347',
  },
  welcomeMessage: {
    marginTop: '60px',
  },
  editButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginRight: '10px',
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
    marginRight: '10px',
  },
  cancelButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
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
    marginTop: '10px',
  },
  input: {
    padding: '8px',
    fontSize: '14px',
    margin: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  fileInput: {
    marginTop: '10px',
  },
};

export default Profile;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from '../API/Authentication';
import { useAuth } from '../Context/AuthContext';
import { getUsername } from '../API/Firestore.js';

const Stream: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuth(); // Get the user context
  const [username, setUsername] = useState<string>(''); // State for the username
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch the username when user is logged in
  useEffect(() => {
    const fetchUsername = async () => {
      if (user.user) {
        const email = user.user.email;
        const fetchedUsername = await getUsername(email); // Async call to fetch username
        setUsername(fetchedUsername);
      } else {
        setUsername('john_doe'); // Default username when user is not authenticated
      }
    };
    fetchUsername();
  }, [user.user]); // Run when the user state changes

  // Handle sign-out functionality
  const handleSignOut = async () => {
    try {
      await signOutUser(); // Log out the user
      navigate('/'); // Navigate to the sign-in page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Start screen capture
  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      videoStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);

      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
        chunks.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing screen media:", err);
    }
  };

  // Stop screen capture
  const stopCapture = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsCapturing(false);
  };

  // Send video to backend (Go API)
  const sendVideoToBackend = async () => {
    if (videoBlob) {
      const formData = new FormData();
      formData.append('file', videoBlob, 'capture.webm');
      formData.append('username', username); // Add the username to the FormData

      try {
        const response = await fetch('http://localhost:8080/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('Video uploaded successfully');
        } else {
          console.error('Video upload failed');
        }
      } catch (err) {
        console.error('Error uploading video:', err);
      }
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
        <h1>Welcome, {username}!</h1>
        <h2>Screen Capture</h2>
        <div>
          <video ref={videoRef} autoPlay muted style={styles.videoPlayer}></video>
          {!isCapturing ? (
            <button onClick={startCapture} style={styles.captureButton}>Start Capture</button>
          ) : (
            <button onClick={stopCapture} style={styles.captureButton}>Stop Capture</button>
          )}
          {videoBlob && !isCapturing && (
            <button onClick={sendVideoToBackend} style={styles.uploadButton}>Send Video</button>
          )}
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
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
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
    backgroundColor: '#ff6347',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  captureButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px 0',
    transition: 'background-color 0.3s',
  },
  uploadButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px 0',
    transition: 'background-color 0.3s',
  },
  welcomeMessage: {
    marginTop: '60px',
    textAlign: 'center',
  },
  videoPlayer: {
    width: '100%',
    maxWidth: '600px',
    height: 'auto',
    border: '2px solid #ccc',
    margin: '20px auto',
    display: 'block',
  },
};

export default Stream;

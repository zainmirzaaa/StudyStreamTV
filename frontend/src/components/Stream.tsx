import React, { useState, useEffect, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { signOutUser } from '../API/Authentication'; 
import { useAuth } from '../Context/AuthContext';
import { getUsername } from '../API/Firestore.js';

const Stream: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuth(); // Get user context
  const [username, setUsername] = useState<string>(''); // Store the username in state
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null); // Correct type for videoBlob
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Type the ref to MediaRecorder
  const videoStreamRef = useRef<MediaStream | null>(null); // Type the ref to MediaStream
  const videoRef = useRef<HTMLVideoElement | null>(null); // Type the ref to HTMLVideoElement
  const [chunks, setChunks] = useState<Blob[]>([]); // Store chunks as state

  // Fetch username when user is authenticated
  useEffect(() => {
    const fetchUsername = async () => {
      if (user.user) {
        const email = user.user.email;
        try {
          const fetchedUsername = await getUsername(email);
          setUsername(fetchedUsername);
          
        } catch (err) {
          console.error('Error fetching username:', err);
          setUsername('john_doe'); // Fallback username in case of error
        }
      } else {
        setUsername('john_doe');
      }
    };

    fetchUsername();
  }, [user.user]);

  // Function to handle sign-out and navigate to the sign-in page
  const handleSignOut = async () => {
    try {
      await signOutUser(); // Log out the user
      navigate('/'); // Redirect to the sign-in page
    } catch (error) {
      console.error('Error signing out:', error); // Handle any errors during sign-out
    }
  };

  // Start screen capture
  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true, // Capture audio
      });
      
      videoStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);

      // Create MediaRecorder to record the stream
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
        setChunks(prevChunks => [...prevChunks, e.data]); // Accumulate chunks
      };

      mediaRecorderRef.current.onstop = () => {
        const finalBlob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(finalBlob); // Save the final video blob
        setChunks([]); // Clear chunks once recording stops
      };

      // Start recording
      mediaRecorderRef.current.start();
      console.log("here")
      // Send video every 10 seconds
      const intervalId = setInterval(() => {
        if (chunks.length > 0) {
          sendVideoToBackend();
          setChunks([]); // Clear chunks after sending
          console.log("heres")
        }
      }, 10000); // 10 seconds interval

      // Store the interval ID to clear it later when the capture is stopped
      mediaRecorderRef.current.onstop = () => clearInterval(intervalId);
    } catch (err) {
      console.error('Error accessing screen media:', err);
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
    if (chunks.length > 0) {
      const formData = new FormData();
      // Concatenate all accumulated chunks into a single Blob
      const videoBlob = new Blob(chunks, { type: 'video/webm' });
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
  },
  signOutButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#ff6347',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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
  },
};

export default Stream;

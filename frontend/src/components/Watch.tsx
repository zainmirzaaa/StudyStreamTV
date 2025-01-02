import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from './Navbar';

function Watch() {
  const { username } = useParams(); // This will get the dynamic username from the URL
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // State to store video URL
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const videoRef = useRef<HTMLVideoElement | null>(null); // Reference to the video element

  // Function to fetch the video URL
  const fetchVideo = async () => {
    try { 
      const link = `http://localhost:8080/video/${username}`;
      const response = await fetch(link);
      
      if (!response.ok) {
        throw new Error("Video not found");
      }

      // Assuming the backend serves the video as a stream
      const blob = await response.blob();
      const newVideoUrl = URL.createObjectURL(blob); // Create a URL for the video blob

      setVideoUrl(newVideoUrl); // Set the video URL for the video player
      setLoading(false); // Set loading to false
    } catch (error) {
      console.error("Error fetching video:", error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  // Poll for new video every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchVideo();
    }, 10000); // Poll every 10 seconds

    // Fetch the first video on mount
    fetchVideo();

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, [username]);

  // Play the new video once the current one ends
  const handleVideoEnd = () => {
    fetchVideo(); // Fetch the next video when the current video ends
  };

  return (
    <div>
      <NavBar />
      <h1>Profile Page of {username}</h1>

      {loading ? (
        <p>Loading video...</p>
      ) : videoUrl ? (
        <div>
          <video
            ref={videoRef}
            controls
            style={{ width: '100%', maxWidth: '800px' }}
            onEnded={handleVideoEnd} // Trigger video change when current video ends
          >
            <source src={videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <p>Video not found for user {username}.</p>
      )}
    </div>
  );
}

export default Watch;

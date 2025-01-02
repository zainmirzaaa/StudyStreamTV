import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from './Navbar';
function Watch() {
  const { username } = useParams(); // This will get the dynamic username from the URL
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // State to store video URL
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    // Fetch the video from the backend based on the username
    const fetchVideo = async () => {
      try { 
        // Make a GET request to the Go backend to get the video for the given username
        const link = "http://localhost:8080/video/" + username
        const response = await fetch(link);
        
        if (!response.ok) {
          throw new Error("Video not found");
        }

        // Assuming the backend serves the video as a stream
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob); // Create a URL for the video blob

        setVideoUrl(videoUrl); // Set the video URL for the video player
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching video:", error);
        setLoading(false); // Set loading to false if there's an error
      }
    };

    fetchVideo();
  }, [username]); // Refetch if the username changes (in case of dynamic routing)

  return (
    <div>
      <NavBar/>
      <h1>Profile Page of {username}</h1>

      {loading ? (
        <p>Loading video...</p>
      ) : videoUrl ? (
        <div>
          <video controls style={{ width: '100%', maxWidth: '800px' }}>
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

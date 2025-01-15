import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from './Navbar';
import { useUser } from '../Context/UserContext'; // Import the useUser hook

function Watch() {
  const { username } = useParams(); // Get dynamic username from URL
  const { user, updateUser } = useUser(); // Access user and updateUser from context
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Video URL state
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // Follow/unfollow state
  const videoRef = useRef<HTMLVideoElement | null>(null); // Video element ref

  // Fetch video from the server
  const fetchVideo = async () => {
    try {
      const link = `http://localhost:8080/video/${username}`;
      const response = await fetch(link);
      
      if (!response.ok) {
        throw new Error("Video not found");
      }

      const blob = await response.blob();
      const newVideoUrl = URL.createObjectURL(blob); // Create a URL for the video blob

      setVideoUrl(newVideoUrl); // Set video URL
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error fetching video:", error);
      setLoading(false); // Stop loading if there's an error
    }
  };

  // Poll for new video every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchVideo();
    }, 10000); // Poll every 10 seconds

    fetchVideo(); // Fetch video on mount

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [username]);

  // Check if user is following the profile when the user context changes
  useEffect(() => {
    if (user && user.following) {
      const isUserFollowing = user.following.includes(username);
      setIsFollowing(isUserFollowing); // Update follow state based on user context
    }
  }, [user, username]); // Only run this effect when `user` or `username` changes

  // Handle video end and fetch new video
  const handleVideoEnd = () => {
    fetchVideo();
  };

  // Toggle follow/unfollow status
  const toggleFollow = () => {
    setIsFollowing(prevState => !prevState); // Toggle follow state
    console.log(isFollowing)
    // Optionally, you might want to update the `user` context as well:
    // updateUser({ ...user, following: newFollowingArray });
    console.log(user)
  };
  

  return (
    <div>
      <NavBar />
      <h1>Profile Page of {username}</h1>

      {/* Display current user information */}
      {user && <p>Logged in as: {user.username} ({user.email})</p>}

      {/* Follow/Unfollow Button */}
      <button onClick={toggleFollow} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>

      {loading ? (
        <p>Loading video...</p>
      ) : videoUrl ? (
        <div>
          <video
            ref={videoRef}
            controls
            style={{ width: '100%', maxWidth: '800px' }}
            onEnded={handleVideoEnd} // Trigger next video when current one ends
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

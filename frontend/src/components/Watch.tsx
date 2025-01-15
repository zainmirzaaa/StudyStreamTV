import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from './Navbar';
import { useUser } from '../Context/UserContext';
import { useAuth } from '../Context/AuthContext';
import { getUsername } from '../API/Firestore';
import { getOnSignIn } from '../API/backendAPI';

function Watch() {
  const { username } = useParams(); // Get dynamic username from URL
  const { user, updateUser } = useUser(); // Access user context
  const { user: authUser } = useAuth(); // Access auth context
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Video URL state
  const [loading, setLoading] = useState<boolean>(true); // General loading state
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // Follow/unfollow state
  const videoRef = useRef<HTMLVideoElement | null>(null); // Video element ref

  // Fetch video from the server
  const fetchVideo = async () => {
    try {
      const link = `http://localhost:8080/video/${username}`;
      const response = await fetch(link);

      if (!response.ok) {
        throw new Error('Video not found');
      }

      const blob = await response.blob();
      const newVideoUrl = URL.createObjectURL(blob); // Create a URL for the video blob

      setVideoUrl(newVideoUrl); // Set video URL
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  // Fetch user information if not already loaded
  const fetchUserData = async () => {
    if (authUser?.email && !user) {
      try {
        console.log('Fetching username for email:', authUser.email);
        const fetchedUsername = await getUsername(authUser.email);

        const userData = await getOnSignIn(fetchedUsername);
        console.log('User Data from API:', userData);

        updateUser(userData); // Update context with user data
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  // Poll for new video every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchVideo, 10000); // Poll every 10 seconds
    fetchVideo(); // Fetch video on mount
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [username]);

  // Fetch user data on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchUserData();
      await fetchVideo();
      setLoading(false); // Stop loading when data is fetched
    };
    loadData();
  }, [authUser, username]);

  // Monitor user context and determine follow status
  useEffect(() => {
    if (user) {
      const isUserFollowing = user.following.includes(username || '');
      setIsFollowing(isUserFollowing);
    }
  }, [user, username]);

  // Handle video end and fetch a new video
  const handleVideoEnd = () => {
    fetchVideo();
  };

  // Toggle follow/unfollow status
  const toggleFollow = () => {
    try {
      setIsFollowing((prevState) => !prevState); // Toggle follow state

      // Update the UserContext
      const updatedFollowing = isFollowing
        ? user?.following.filter((name) => name !== username)
        : [...(user?.following || []), username || ''];

      if (user) {
        updateUser({ ...user, following: updatedFollowing });
      }
    } catch (error) {
      console.error('Error toggling follow state:', error);
    }
  };

  // Render loading state if necessary
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <NavBar />
      <h1>Profile Page of {username}</h1>

      {/* Display current user information */}
      {user ? (
        <p>
          Logged in as: {user.username} ({user.email})
        </p>
      ) : (
        <p>User information not available.</p>
      )}

      {/* Follow/Unfollow Button */}
      {user && (
        <button
          onClick={toggleFollow}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            marginBottom: '20px',
          }}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}

      {/* Video Display */}
      {videoUrl ? (
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

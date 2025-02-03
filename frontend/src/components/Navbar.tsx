import React, { useState } from 'react';
import { signOutUser } from '../API/Authentication';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to toggle search bar visibility
  const [searchQuery, setSearchQuery] = useState(''); // State to track the search query
  const navigate = useNavigate();

  // Handle search action when "Enter" is pressed or the search icon is clicked
  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      console.log('Search for:', searchQuery);
      // You can replace this with your actual search logic (e.g., API call)
      // For example, navigate to a search results page:
      // navigate(`/search?query=${searchQuery}`);
      setSearchQuery(''); // Clear the search bar after the search is performed
      setIsSearchOpen(false); // Close the search bar after search
    }
  };

  // Handle "Enter" key press in the search bar
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser(); // Log out the user
      navigate('/'); // Redirect to the sign-in page
    } catch (error) {
      console.error('Error signing out:', error); // Handle any errors during sign-out
    }
  };

  const handleSearchClick = () => {
    setIsSearchOpen((prev) => !prev); // Toggle the search bar visibility
  };

  return (
    <div>
      <nav style={styles.navbar}>
        <div style={styles.navLinks}>
          <a href="/profile" style={styles.navLink}>Profile</a>
          <a href="/stream" style={styles.navLink}>Stream</a>
          <a href="/watch" style={styles.navLink}>Watch</a>
          <a href="/recommendation" style={styles.navLink}>Recommendations</a>
        </div>

        {/* Search Icon or Search Bar */}
        <div style={styles.searchContainer}>
          <button
            onClick={handleSearchClick}
            style={styles.searchIcon}
            aria-label="Search"
          >
            🔍
          </button>

          {isSearchOpen && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              style={styles.searchBar}
              onKeyDown={handleKeyDown} // Trigger search on "Enter"
            />
          )}
        </div>

        <button onClick={handleSignOut} style={styles.signOutButton}>
          Logout
        </button>
      </nav>
    </div>
  );
};

const styles = {
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
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    fontSize: '20px',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  searchBar: {
    padding: '5px 10px',
    fontSize: '16px',
    marginLeft: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    transition: 'width 0.3s ease-in-out',
    width: '200px',
  },
};

export default NavBar;

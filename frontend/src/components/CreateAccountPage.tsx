// src/components/CreateAccountPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../API/Authentication';
import {addToMongoDB} from '../API/backendAPI'

function CreateAccountPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password); // Check if password meets criteria
  };

  

  const handleClick = async (action: string, email: string, username: string, password: string) => {
    switch (action) {
      case 'createAccount':


      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      if (!isValidPassword(password)) {
        alert('Password must be at least 6 characters and contain both letters and numbers.');
        return;
      }
        if (password === confirmPassword) {
          setIsLoading(true);
          // Wait for the API response
          const apiResponse = await createUser(email, username, password);
          console.log(apiResponse);
          setIsLoading(false);
          addToMongoDB(username, email)
          if (apiResponse !== "not allowed") {
            navigate('/home'); // Navigate after successful account creation
          }
        } else {
          alert('Passwords do not match');
        }
        break;
      case 'signIn':
        navigate('/');
        break;
      case 'skipLogin':
        alert('Skipping login');
        navigate('/home');
        break;
      default:
        break;
    }
  };
  

  return (
    <div className="create-account-page">
      <div className="create-account-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={() => handleClick('createAccount', email, username, password)}>
          Create Account
        </button>
        <button onClick={() => handleClick('signIn', '', '', '')}>Sign In with Email</button>
        <button className="skip-login" onClick={() => handleClick('skipLogin', '', '', '')}>
          Skip Login
        </button>
      </div>
    </div>
  );
}

export default CreateAccountPage;

// src/components/SignInPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const {user, loading } = useAuth();


    if(user){
        navigate('/home')
        return null;
    }
  const handleClick = (action: string, email: string, password: string) => {
    switch (action) {
      case 'signIn':
        if (email && password) {
          // Here you can handle the actual sign-in logic (e.g., calling an API)
          alert(`Signing in with email: ${email} and password: ${password}`);
          navigate('/home'); // Navigate to dashboard after sign-in
        } else {
          alert('Please enter both email and password');
        }
        break;
      case 'createAccount':
        navigate('/create-account');
        break;
      case 'skipLogin':
        alert('Skipping login');
        navigate('/home')
        break;
      default:
        break;
    }
  };

  return (
    <div className="sign-in-page">
      <div className="login-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => handleClick('signIn', email, password)}>Sign In</button>
        <button onClick={() => handleClick('createAccount', '', '')}>Create Account</button>
        <button className="skip-login" onClick={() => handleClick('skipLogin', '', '')}>
          Skip Login
        </button>
      </div>
    </div>
  );
}

export default SignInPage;

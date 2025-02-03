import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInPage from './components/SignInPage';
import CreateAccountPage from './components/CreateAccountPage';
import './App.css';
import { AuthProvider } from './Context/AuthContext';
import Home from './components/Home';
import Profile from './components/Profile';
import Stream from './components/Stream.tsx';
import Watch from './components/Watch.tsx';
import { Recommendation } from './components/Recommendation.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage/>} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/stream" element={<Stream />} />
        <Route path="/:username" element={<Watch />} />
        <Route path="/recommendation" element={<Recommendation/>}/>
      </Routes>
    </Router>
  
  );
}

export default App;

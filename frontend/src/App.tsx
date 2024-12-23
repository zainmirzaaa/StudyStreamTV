import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInPage from './components/SignInPage';
import CreateAccountPage from './components/CreateAccountPage';
import './App.css';
import { AuthProvider } from './Context/AuthContext';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage/>} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  
  );
}

export default App;

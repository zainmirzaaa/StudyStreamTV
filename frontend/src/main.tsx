import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Context/AuthContext.tsx'
import {UserProvider} from '../src/Context/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   
    <AuthProvider>
    <UserProvider>
    <App />
    </UserProvider>,
  </AuthProvider>,
  </StrictMode>,
)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer'; 

// Add Theme imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define the new black and white theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black
    },
    secondary: {
      main: '#ffffff', // White
    },
  },
});

// A wrapper to protect routes that require authentication
// Ensure this function is only defined ONCE in this file
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <LoginPage />;
}

function App() {
  return (
    
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
           <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
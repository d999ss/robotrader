import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/layout/Navbar';
import HomePage from './components/layout/HomePage';
import RobotList from './components/robots/RobotList';
import RobotDetails from './components/robots/RobotDetails';
import CreateRobotListing from './components/robots/CreateRobotListing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserProfile from './components/user/UserProfile';
import theme from './theme';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh' 
        }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/robots" element={<RobotList />} />
              <Route path="/robots/:id" element={<RobotDetails />} />
              <Route
                path="/create-listing"
                element={
                  <ProtectedRoute>
                    <CreateRobotListing />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import AppRoutes from './routes';
import Navbar from './components/layout/Navbar';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default 
        }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <AppRoutes />
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;

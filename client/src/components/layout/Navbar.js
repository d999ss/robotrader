import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Favorite as FavoriteIcon,
  List as ListIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0}
      sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 800,
              letterSpacing: '-0.025em',
            }}
          >
            RoboTrader
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {user ? (
                  [
                    <MenuItem 
                      key="profile" 
                      onClick={() => {
                        navigate('/profile');
                        handleClose();
                      }}
                    >
                      <PersonIcon sx={{ mr: 1 }} />
                      Profile
                    </MenuItem>,
                    <MenuItem 
                      key="create" 
                      onClick={() => {
                        navigate('/robots/new');
                        handleClose();
                      }}
                    >
                      <AddIcon sx={{ mr: 1 }} />
                      Create Listing
                    </MenuItem>,
                    <MenuItem 
                      key="listings" 
                      onClick={() => {
                        navigate('/my-listings');
                        handleClose();
                      }}
                    >
                      <ListIcon sx={{ mr: 1 }} />
                      My Listings
                    </MenuItem>,
                    <MenuItem 
                      key="favorites" 
                      onClick={() => {
                        navigate('/favorites');
                        handleClose();
                      }}
                    >
                      <FavoriteIcon sx={{ mr: 1 }} />
                      Favorites
                    </MenuItem>,
                    <MenuItem key="logout" onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  ]
                ) : (
                  [
                    <MenuItem 
                      key="login" 
                      onClick={() => {
                        navigate('/login');
                        handleClose();
                      }}
                    >
                      Login
                    </MenuItem>,
                    <MenuItem 
                      key="register" 
                      onClick={() => {
                        navigate('/register');
                        handleClose();
                      }}
                    >
                      Register
                    </MenuItem>
                  ]
                )}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {user ? (
                <>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/robots/new"
                    startIcon={<AddIcon />}
                  >
                    Create Listing
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/my-listings"
                    startIcon={<ListIcon />}
                  >
                    My Listings
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/favorites"
                    startIcon={<FavoriteIcon />}
                  >
                    Favorites
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/profile"
                    startIcon={<PersonIcon />}
                  >
                    Profile
                  </Button>
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/register"
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

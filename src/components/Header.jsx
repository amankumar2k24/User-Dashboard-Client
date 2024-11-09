import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/slices/themeSlice";
import { logout } from "../store/slices/authSlice";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const currentTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light", 
    },
  });

  
  const handleThemeToggle = () => {
    dispatch(toggleTheme()); 
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Box style={{ color: "inherit", textDecoration: "none" }}>
              User Dashboard
            </Box>
          </Typography>

          {!isMobile && (
            <>
              <Button color="inherit">
                <Link
                  to="/dashboard/home"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Home
                </Link>
              </Button>
              {/* <Button color="inherit">
                <Link
                  to="/dashboard/activity-logs"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Logs
                </Link>
              </Button> */}
            </>
          )}

          <IconButton color="inherit" onClick={handleThemeToggle}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link
                to="/dashboard/profile"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Profile
              </Link>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List>
          <ListItem button onClick={() => setDrawerOpen(false)}>
            <ListItemText>
              <Link to="/" style={{ textDecoration: "none" }}>
                Home
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem button onClick={() => setDrawerOpen(false)}>
            <ListItemText>
              <Link
                to="/dashboard/activity-logs"
                style={{ textDecoration: "none" }}
              >
                Logs
              </Link>
            </ListItemText>
          </ListItem>
        </List>
      </Drawer>
    </ThemeProvider>
  );
};

export default Header;

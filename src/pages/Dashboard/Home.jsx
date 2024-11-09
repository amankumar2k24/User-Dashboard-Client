import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchActivityLogs } from "../../store/slices/activityLogSlice";
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Pagination,
  Button,
} from "@mui/material";
import { getFriendsList } from "../../store/slices/friendSlice";
import { toggleTheme } from "../../store/slices/themeSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Accessing data from Redux state
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { logs, status, error } = useSelector((state) => state.activityLog);
  const { list: friendsList } = useSelector((state) => state.friends);
  console.log("friendsList", friendsList);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [page, setPage] = useState(1);
  const logsPerPage = 5; // Customize this to show more/less logs per page

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      const token = localStorage.getItem("token");
      dispatch(fetchActivityLogs(token));
      dispatch(getFriendsList(user?.data?._id));
    }
  }, [dispatch, isAuthenticated, navigate, user?.data?._id]);

  const lastLoginTime = user?.lastLoginTime
    ? new Date(user.lastLoginTime).toLocaleString()
    : "N/A";

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedLogs = logs.slice(
    (page - 1) * logsPerPage,
    page * logsPerPage
  );

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Grid container spacing={3} sx={{ marginTop: "4px" ,}}>
      {/* Left Section: Activity Logs */}
      <Grid item xs={12} sm={7}>
        <Paper
          sx={{
            padding: 3,
            bgcolor: darkMode ? "grey.900" : "white",
            color: darkMode ? "white" : "black",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" gutterBottom>
              Welcome{" "}
              <span style={{ textTransform: "capitalize" }}>
                {user?.data?.username}
              </span>
            </Typography>
            <Typography variant="body1" sx={{ marginLeft: 2 }}>
              Last Login: {lastLoginTime}
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            Activity Feed
          </Typography>
          {status === "loading" && <CircularProgress />}
          {status === "failed" && (
            <Typography color="error">Error: {error}</Typography>
          )}
          {status === "succeeded" && logs.length === 0 && (
            <Typography>No activity logs found.</Typography>
          )}
          {status === "succeeded" && (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Activity</TableCell>
                      <TableCell align="right">Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedLogs.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell>{log.activity}</TableCell>
                        <TableCell align="right">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={Math.ceil(logs.length / logsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color={darkMode ? "secondary" : "primary"}
                  sx={{
                    button: {
                      color: darkMode ? "white" : "black",
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Paper>
      </Grid>

      {/* Right Section: Friends List */}
      <Grid item xs={12} sm={4}>
        <Paper
          sx={{
            padding: 3,
            bgcolor: darkMode ? "grey.900" : "white",
            color: darkMode ? "white" : "black",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Friends List
          </Typography>
          <List>
            {friendsList && friendsList.length > 0 ? (
              friendsList.map((friend, index) => (
                <ListItem key={friend._id}>
                  <ListItemText
                    primary={`${index + 1}. ${
                      friend.username.charAt(0).toUpperCase() +
                      friend.username.slice(1)
                    } (${friend.email})`}
                    sx={{ color: darkMode ? "white" : "black" }}
                  />
                </ListItem>
              ))
            ) : (
              <Box>Still No Friends ☹️</Box>
            )}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Home;

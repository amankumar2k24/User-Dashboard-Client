import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../../store/slices/userSlice";
import {
  Avatar,
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Stack,
  useTheme,
} from "@mui/material";
import { toggleTheme } from "../../store/slices/themeSlice";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Profile = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { profile, loading, error } = useSelector((state) => state.user);
  const user = useSelector((state) => state.auth.user);
  const { darkMode } = useSelector((state) => state.theme);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
    file: null,
  });
  const [filePreview, setFilePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch, isUpdating]);

  useEffect(() => {
    if (profile) {
      setEditData({
        username: profile.username,
        email: profile.email,
        file: profile.file,
      });
      setFilePreview(profile.file);
    }
  }, [profile]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    if (filePreview && editData.file instanceof File) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(profile?.file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData((prevData) => ({ ...prevData, file }));
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);

      // Revoke the old object URL if a new file is selected
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("username", editData.username);
    formData.append("email", editData.email);
    if (editData.file instanceof File) {
      formData.append("file", editData.file);
    }

    await dispatch(updateProfile({ formData, userId: user.data._id }));
    await dispatch(fetchProfile());

    setIsUpdating(false);
    handleCloseModal();
  };

  const customTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ p: 3, textAlign: "center", marginTop: "10px" }}>
        <Box
          sx={{
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
            maxWidth: 500,
            mx: "auto",
            mt: 4,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: darkMode ? "white" : "black" }}
          >
            User Profile
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">
              Error: {error.message || error}
            </Typography>
          ) : profile ? (
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Avatar
                src={filePreview}
                alt="Profile"
                sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
              />
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  variant="h6"
                  className="capitalize"
                  sx={{ color: darkMode ? "white" : "black" }}
                >
                  {profile.username}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: darkMode ? "white" : "black" }}
                >
                  {profile.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Role: {profile.role}
                </Typography>
              </Box>
            </Stack>
          ) : (
            <Typography>No profile data</Typography>
          )}

          {!loading && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              sx={{ mt: 3 }}
            >
              Update Profile
            </Button>
          )}
        </Box>

        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              textAlign: "center",
            }}
          >
            <Avatar
              src={filePreview}
              alt="Profile"
              sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
            />
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: darkMode ? "white" : "black" }}
            >
              Edit Profile
            </Typography>
            <TextField
              label="Username"
              name="username"
              value={editData.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={editData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Upload Profile Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {editData.file && (
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mt: 1 }}
              >
                Selected file:{" "}
                {(editData.file instanceof File
                  ? editData.file.name
                  : profile.file
                ).slice(0, 40)}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateProfile}
              fullWidth
              sx={{ mt: 3 }}
            >
              {isUpdating ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;

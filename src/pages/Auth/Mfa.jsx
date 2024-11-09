import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { verifyMFA } from "../../services/api.services"; 
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import QRCode from "react-qr-code"; 
import { getToken, setToken } from "../../helper/tokenHelper";
import { useSelector } from "react-redux";

const Mfa = () => {
  const { userId } = useParams(); 
  const [mfaCode, setMfaCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState(""); 
  const [secretKey, setSecretKey] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user: responseUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const response = {
      success: responseUser?.success,
      mfaEnabled: responseUser?.mfaEnabled,
      message: responseUser?.message,
      mfaSecret: responseUser?.mfaSecret,
      qrcode: responseUser?.qrcode,
    };
    if (response.success && response.mfaEnabled) {
      setQrCodeUrl(response.qrcode);
      setSecretKey(response.mfaSecret);
    }
  }, [responseUser]);

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await verifyMFA({ userId, mfaToken: mfaCode });
      if (response.success) {
        toast.success(response.message);
        setToken(response.token);
        localStorage.setItem("isAuthenticated", true);
        navigate("/dashboard/home");
      } else {
        throw new Error("Invalid MFA code");
      }
    } catch (error) {
      console.log("errror", error);
      toast.error("Invalid MFA code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, textAlign: "center" }}
      >
        Multi-Factor Authentication
      </Typography>
      <Typography
        variant="body1"
        paragraph
        sx={{ textAlign: "center", maxWidth: 600 }}
      >
        Please scan the QR code with your authenticator app and enter the code
        below.
      </Typography>

      {qrCodeUrl && (
        <Card sx={{ maxWidth: 300, padding: 2, marginBottom: 2 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <QRCode value={qrCodeUrl} size={200} level="M" />
            <Typography variant="body2" sx={{ marginTop: 2, color: "gray" }}>
              {secretKey && (
                <span>
                  <strong>Secret Key: </strong>
                  {secretKey}
                </span>
              )}
            </Typography>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleMfaSubmit} style={{ width: "100%", maxWidth: 400 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <TextField
              label="Enter MFA Code"
              variant="outlined"
              fullWidth
              required
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              inputProps={{ maxLength: 6 }}
              sx={{ marginBottom: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              disabled={loading || mfaCode.length !== 6}
              sx={{
                padding: 1.5,
                fontSize: "16px",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Verify Code"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Divider sx={{ marginTop: 3 }} />
      <Box sx={{ marginTop: 2, textAlign: "center" }}>
        <Typography variant="body2" color="textSecondary">
          Need help? <a href="#">Contact Support</a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Mfa;

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
        gutterBottom
        sx={{ textAlign: "center", mt: 3, fontWeight: "bold", fontSize: 24 }}
      >
        Set Up Two-Factor Authentication (2FA)
      </Typography>
      <Box
        className="flex flex-col gap-4 lg:flex-row justify-center items-center"
        sx={{
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          marginBottom: "20px",
          mx: "auto",
          mt: 4,
        }}
      >
        <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "left" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }} paragraph>
            Follow these steps to complete the setup:
          </Typography>

          <Typography sx={{ fontSize: "15px", marginTop: "4px" }}>
            <strong>Step 1:</strong> Open your Microsoft authenticator app
          </Typography>

          <Typography sx={{ fontSize: "15px", marginTop: "4px" }}>
            <strong>Step 2:</strong> Scan the QR code displayed on this screen.
            In your app, choose the option to add a new account, then select
            “Scan a QR code.”
          </Typography>

          <Typography sx={{ fontSize: "15px", marginTop: "4px" }}>
            <strong>Step 3:</strong> When prompted, choose “Work Account” in the
            authenticator app. You may also need to enter a name for this
            account.
          </Typography>

          <Typography sx={{ fontSize: "15px", marginTop: "4px" }}>
            <strong>Step 4:</strong> Enter the secret key displayed below the QR
            code on this screen if required. This step is an alternative if
            you're unable to scan the QR code.
          </Typography>

          <Typography sx={{ fontSize: "15px", marginTop: "4px" }}>
            <strong>Step 5:</strong> In your authenticator app, a Time-based
            One-Time Password (TOTP) code will appear. Enter this code below to
            complete the 2FA setup.
          </Typography>
        </Box>

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
      </Box>

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
    </Box>
  );
};

export default Mfa;

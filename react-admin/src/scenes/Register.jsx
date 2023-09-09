import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify'
import Warehousedb from "../apis/Warehousedb";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useTheme } from "@emotion/react";
import { tokens } from "../theme";

const Register = ({ setAuth }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  let navigate = useNavigate();

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const res = await Warehousedb.post("/auth/register", {
        email,
        password,
        name,
      });

      //const parseRes = await response.json();
      //console.log(parseRes)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        //setAuth(true);

        // toast.success("Registered successfully!")
        navigate(`/login`);
      } else {
        setAuth(false);
        // toast.error(res)
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 8,
      }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AppRegistrationIcon
          sx={{ m: 1, bgcolor: colors.greenAccent[700], borderRadius: "8px" }}
        />
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={onSubmitForm}
          sx={{
            mt: 1,
          }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              ":hover": {
                bgcolor: colors.greenAccent[700], // theme.palette.primary.main
                color: "white",
              },
            }}
          >
            Sign Up
          </Button>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs>
              <Link href="/login" variant="body2">
                Back to Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box mt={8}></Box>
    </Container>
  );
};

export default Register;

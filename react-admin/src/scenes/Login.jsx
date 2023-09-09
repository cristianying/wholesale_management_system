import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify'
import Warehousedb from "../apis/Warehousedb";
import { Box, Container, Grid, Link, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useTheme } from "@emotion/react";
import { tokens } from "../theme";
import { WarehouseContext } from "../context/WarehouseContext";
import FormTextField from "../components/FormsUI/Textfield";
import FormButton from "../components/FormsUI/Button";

const Login = ({ setAuth }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { setProducts } = useContext(WarehouseContext);
  const { setClients } = useContext(WarehouseContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setProducts([]);
    setClients([]);
    try {
      const res = await Warehousedb.post("/auth/login", {
        email,
        password,
      });

      if (res.data.token) {
        // console.log("got toekn ", res.data.token);
        localStorage.setItem("token", res.data.token);
        setAuth(true);
        navigate("/");
      } else {
        setAuth(false);
      }
    } catch (error) {
      console.error(error.message);
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
        <LockOutlinedIcon
          sx={{ m: 1, bgcolor: colors.greenAccent[700], borderRadius: "8px" }}
        />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={onSubmitForm}
          sx={{
            mt: 1,
          }}
        >
          <FormTextField
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormTextField
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" />}
            label="Remember me"
            sx={{ mt: 1 }}
          /> */}
          <FormButton>Sign In</FormButton>
          <Grid container direction="row">
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box mt={8}></Box>
    </Container>
  );
};

export default Login;

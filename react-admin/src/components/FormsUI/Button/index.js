import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";

const ButtonWrapper = ({ ...otherProps }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const configButton = {
    ...otherProps,
    type: "submit",
    fullWidth: true,
    variant: "contained",
    sx: {
      mt: 3,
      mb: 2,
      ":hover": {
        bgcolor: colors.greenAccent[700], // theme.palette.primary.main
        color: "white",
      },
    },
  };

  return <Button {...configButton} />;
};

export default ButtonWrapper;

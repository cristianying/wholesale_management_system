import React from "react";
import { TextField } from "@mui/material";

const TextfieldWrapper = ({ ...otherProps }) => {
  const configTextfield = {
    ...otherProps,
    variant: "outlined",
    margin: "normal",
    required: true,
    fullWidth: true,
  };

  return <TextField {...configTextfield} />;
};

export default TextfieldWrapper;

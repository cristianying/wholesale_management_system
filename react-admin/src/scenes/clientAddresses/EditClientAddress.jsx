import React, { useState } from "react";
import warehousedb from "../../apis/Warehousedb";
import FormTextField from "../../components/FormsUI/Textfield";
import FormButton from "../../components/FormsUI/Button";
import { Box, Container, Typography } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { toast } from "react-toastify";

const EditClientAddress = ({
  setOpenEdit,
  editClientAddress,
  setClientAddresses,
  clientAddresses,
}) => {
  const [name, setName] = useState(editClientAddress[0].name);
  const [email, setEmail] = useState(editClientAddress[0].email);
  const [telephone, setTelephone] = useState(editClientAddress[0].telephone);
  const [address, setAddress] = useState(editClientAddress[0].address);
  const [country, setCountry] = useState(editClientAddress[0].country);
  const [note, setNote] = useState(editClientAddress[0].note);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    setDisabled(true);
    e.preventDefault();
    try {
      await warehousedb.put(
        `/api/v1/client_addresses/${editClientAddress[0].delivery_address_id}`,
        {
          name,
          email,
          telephone,
          address,
          country,
          note,
        }
      );

      const index = clientAddresses.findIndex(
        (address) =>
          editClientAddress[0].delivery_address_id ===
          address.delivery_address_id
      );
      clientAddresses[index].name = name;
      clientAddresses[index].email = email;
      clientAddresses[index].telephone = telephone;
      clientAddresses[index].address = address;
      clientAddresses[index].country = country;
      clientAddresses[index].note = note;

      setClientAddresses(clientAddresses);

      // console.log("new one: ", clientAddresses[index]);

      setOpenEdit(false);
      toast("Your changes have beeen saved");
    } catch (err) {
      console.log(err);
      setDisabled(false);
    }
  };

  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ManageAccountsIcon
            sx={{ m: 1, bgcolor: colors.greenAccent[700], borderRadius: "8px" }}
          />
          <Typography component="h1" variant="h5">
            Edit Client <form action="" method="post"></form>
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 1,
            }}
          >
            <FormTextField
              id="name"
              label="name"
              name="name"
              autoComplete="name"
              value={name ? name : ""}
              onChange={(e) => setName(e.target.value)}
            />
            <FormTextField
              id="email"
              label="email"
              name="email"
              autoComplete="email"
              value={email ? email : ""}
              type={"email"}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormTextField
              id="telephone"
              label="telephone"
              name="telephone"
              autoComplete="telephone"
              value={telephone ? telephone : ""}
              onChange={(e) => setTelephone(e.target.value)}
            />
            <FormTextField
              id="address"
              label="address"
              name="address"
              autoComplete="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <FormTextField
              id="country"
              label="country"
              name="country"
              autoComplete="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <FormTextField
              id="note"
              label="note"
              name="note"
              autoComplete="note"
              value={note ? note : ""}
              onChange={(e) => setNote(e.target.value)}
              multiline={true}
              rows={4}
            />
            <FormButton disabled={disabled}>SAVE CHANGES</FormButton>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default EditClientAddress;

import React, { useState } from "react";
import warehousedb from "../../apis/Warehousedb";
import FormTextField from "../../components/FormsUI/Textfield";
import FormButton from "../../components/FormsUI/Button";
import { Box, Button, Container, Typography } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { toast } from "react-toastify";

const EditClient = ({ setOpenEdit, editClient, setClients, clients }) => {
  const [name, setName] = useState(editClient[0].name);
  const [email, setEmail] = useState(editClient[0].email);
  const [telephone, setTelephone] = useState(editClient[0].telephone);
  const [address, setAddress] = useState(editClient[0].address);
  const [country, setCountry] = useState(editClient[0].country);
  const [note, setNote] = useState(editClient[0].note);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    setDisabled(true);
    e.preventDefault();
    try {
      await warehousedb.put(`/api/v1/clients/${editClient[0].client_id}`, {
        name,
        email,
        telephone,
        address,
        country,
        note,
      });

      const index = clients.findIndex(
        (client) => editClient[0].client_id === client.client_id
      );
      clients[index].name = name;
      clients[index].email = email;
      clients[index].telephone = telephone;
      clients[index].address = address;
      clients[index].country = country;
      clients[index].note = note;

      setClients(clients);

      console.log("new one: ", clients[index]);

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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormTextField
              id="email"
              label="email"
              name="email"
              autoComplete="email"
              value={email}
              type={"email"}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormTextField
              id="telephone"
              label="telephone"
              name="telephone"
              autoComplete="telephone"
              value={telephone}
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
              value={note}
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

export default EditClient;

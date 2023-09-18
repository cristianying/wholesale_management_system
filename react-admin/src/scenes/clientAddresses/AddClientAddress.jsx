import React, { useState, useContext } from "react";
import { WarehouseContext } from "../../context/WarehouseContext";
import warehousedb from "../../apis/Warehousedb";
import FormTextField from "../../components/FormsUI/Textfield";
import FormButton from "../../components/FormsUI/Button";
import { Box, Container, TextField, Typography, MenuItem } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const AddClientAddress = ({ setOpenAdd, clients }) => {
  const { addClientAddresses } = useContext(WarehouseContext);
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [note, setNote] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    setDisabled(true);
    e.preventDefault();
    try {
      const response = await warehousedb.post(
        "/api/v1/client_addresses",
        {
          clientId,
          name,
          email,
          telephone,
          address,
          country,
          note,
        },
        {
          headers: { token: localStorage.token },
        }
      );

      response.data.data.address.client_name = clientName;
      console.log(response.data.data);
      setOpenAdd(false);
      addClientAddresses(response.data.data.address);
    } catch (err) {
      console.log(err);
      setDisabled(false);
    }
  };

  const handleNameChange = (e) => {
    const selectedProduct = clients.find(
      (client) => client.client_id === e.target.value
    );
    setClientId(e.target.value);
    setClientName(selectedProduct.name);
    // console.log("im the client: ", name, clientId);
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
          <PersonAddAlt1Icon
            sx={{ m: 1, bgcolor: colors.greenAccent[700], borderRadius: "8px" }}
          />
          <Typography component="h1" variant="h5">
            Add new address <form action="" method="post"></form>
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 1,
            }}
          >
            <TextField
              select
              fullWidth
              label="Select client"
              defaultValue=""
              helperText="Please select your client"
              onChange={handleNameChange}
            >
              {clients &&
                clients.map((client) => {
                  return (
                    <MenuItem key={client.client_id} value={client.client_id}>
                      {client.name}
                    </MenuItem>
                  );
                })}
            </TextField>
            <FormTextField
              id="name"
              label="address name"
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
              onChange={(e) => setEmail(e.target.value)}
              type={"email"}
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
            <FormButton disabled={disabled}>SUBMIT</FormButton>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AddClientAddress;

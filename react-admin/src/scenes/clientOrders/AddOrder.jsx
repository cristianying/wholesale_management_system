import React, { useState, useContext } from "react";
import { WarehouseContext } from "../../context/WarehouseContext";
import warehousedb from "../../apis/Warehousedb";
import { Box, Container, TextField, Typography, MenuItem } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import FormButton from "../../components/FormsUI/Button";

const AddOrder = ({ setOpenAdd, clients }) => {
  const [clientId, setClientId] = useState("");
  const [clientAddressId, setClientAddressId] = useState("");
  // const [name, setName] = useState("");
  const { addClientOrders, clientOrders } = useContext(WarehouseContext);
  const { clientAddresses, setClientAddresses } = useContext(WarehouseContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [disabled, setDisabled] = useState(false);

  console.log("client addreses ", clientAddresses);
  // console.log(clients);
  const handleSubmit = async (e) => {
    setDisabled(true);
    e.preventDefault();
    try {
      const response = await warehousedb.post(
        "/api/v1/client_orders",
        {
          clientId,
          clientAddressId,
        },
        {
          headers: { token: localStorage.token },
        }
      );
      // add client name to new add order object
      response.data.data.client_order.client_name =
        response.data.data.order_client_name.name;
      setOpenAdd(false);
      addClientOrders(response.data.data.client_order);
    } catch (err) {
      console.log(err);
      setDisabled(false);
    }
  };

  // const handleClientNameChange = (e) => {
  //   const selectedClient = clients.find(
  //     (client) => client.client_id === e.target.value
  //   );
  //   // setName(selectedClient ? selectedClient.name : e.target.value);
  //   setClientId(e.target.value);
  //   // console.log("im the client: ", name, clientId);
  // };

  // const handleAddressNameChange = (e) => {
  //   const selectedAddress = clients.find(
  //     (client) => client.client_id === e.target.value
  //   );
  //   // setName(selectedClient ? selectedClient.name : e.target.value);
  //   setClientId(e.target.value);
  //   // console.log("im the client: ", name, clientId);
  // };

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
            Add new order <form action="" method="post"></form>
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
              label="Select client"
              defaultValue=""
              helperText="Please select your client"
              onChange={(e) => setClientId(e.target.value)}
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

            <TextField
              select
              label="Select client"
              defaultValue=""
              helperText="Please select your client"
              onChange={(e) => setClientAddressId(e.target.value)}
            >
              {clientAddresses &&
                clientAddresses.map((address) => {
                  return (
                    <MenuItem
                      key={address.delivery_address_id}
                      value={address.delivery_address_id}
                    >
                      {address.name}
                    </MenuItem>
                  );
                })}
            </TextField>

            <FormButton disabled={disabled}>SUBMIT</FormButton>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AddOrder;

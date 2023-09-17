import React, { useState, useContext } from "react";
import { WarehouseContext } from "../../context/WarehouseContext";
import warehousedb from "../../apis/Warehousedb";
import { Box, Container, Typography, MenuItem } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import FormButton from "../../components/FormsUI/Button";
import FormTextField from "../../components/FormsUI/Textfield";

const AddOrder = ({ setOpenAdd, clients, setAuth }) => {
  const [client, setClient] = useState([]);
  const [clientAddress, setClientAddress] = useState("");
  // const [name, setName] = useState("");
  const { addClientOrders } = useContext(WarehouseContext);
  const [selectAddresses, setSelectAddresses] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    // need to JSON parse here, if not it will show error in the menuitem
    const jsonClientAddress = JSON.parse(clientAddress);
    setDisabled(true);
    e.preventDefault();
    try {
      const response = await warehousedb.post(
        "/api/v1/client_orders",
        {
          clientId: client.client_id,
          clientAddressId: jsonClientAddress.delivery_address_id,
        },
        {
          headers: { token: localStorage.token },
        }
      );
      // add client name to new add order object
      // response.data.data.client_order.client_name =
      //   response.data.data.order_client_name.name;
      response.data.data.client_order.client_name = client.name;

      response.data.data.client_order.client_address =
        jsonClientAddress.address;

      setOpenAdd(false);
      addClientOrders(response.data.data.client_order);
    } catch (err) {
      console.log(err);
      setDisabled(false);
    }
  };

  const handleClientNameChange = (e) => {
    const selectedClient = JSON.parse(e.target.value);
    setClientAddress("");
    const fetchData = async () => {
      try {
        const client_addresses = await warehousedb.get(
          `/api/v1/client_addresses/${selectedClient.client_id}`,
          {
            headers: { token: localStorage.token },
          }
        );
        // console.log(client_addresses.data.data.client_addresses);
        if (client_addresses.data.data.client_addresses.length !== 0) {
          setSelectAddresses(client_addresses.data.data.client_addresses);
        }
        setClient(selectedClient);
        // console.log(client_addresses.data.data.client_addresses);
      } catch (err) {
        localStorage.removeItem("token");
        setAuth(false);
        console.log(err);
      }
    };

    fetchData();
    // const selectedClient = clients.find(
    //   (client) => client.client_id === e.target.value
    // );
    // setName(selectedClient ? selectedClient.name : e.target.value);

    // console.log("im the client: ", name, clientId);
  };

  // const handleAddressNameChange = (e) => {
  //   const selectedAddress = clients.find(
  //     (client) => client.client_id === e.target.value
  //   );
  //   // setName(selectedClient ? selectedClient.name : e.target.value);
  //   setClientId(e.target.value);
  //   // console.log("im the client: ", name, clientId);
  // };

  // console.log("render");
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
            <FormTextField
              select
              label="Select client"
              defaultValue=""
              helperText="Please select your client"
              onChange={handleClientNameChange}
              // onChange={(e) => setClientId(e.target.value)}
            >
              {clients &&
                clients.map((client) => {
                  return (
                    <MenuItem
                      key={client.client_id}
                      value={JSON.stringify({
                        client_id: client.client_id,
                        name: client.name,
                      })}
                    >
                      {client.name}
                    </MenuItem>
                  );
                })}
            </FormTextField>

            <FormTextField
              select
              label="Select Client Address"
              defaultValue=""
              value={clientAddress}
              disabled={client.client_id ? false : true}
              helperText="Please select your client"
              onChange={(e) => setClientAddress(e.target.value)}
            >
              {selectAddresses &&
                selectAddresses.map((address) => {
                  // console.log(address.delivery_address_id);
                  return (
                    <MenuItem
                      key={address.delivery_address_id}
                      value={JSON.stringify({
                        delivery_address_id: address.delivery_address_id,
                        address_name: address.name,
                        address: address.address,
                      })}
                    >
                      {address.name}
                    </MenuItem>
                  );
                })}
            </FormTextField>

            <FormButton disabled={disabled}>SUBMIT</FormButton>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AddOrder;

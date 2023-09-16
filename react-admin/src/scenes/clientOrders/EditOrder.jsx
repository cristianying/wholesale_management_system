import React, { useState } from "react";
import warehousedb from "../../apis/Warehousedb";
import { Box, Container, Typography, MenuItem, Grid } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import FormTextField from "../../components/FormsUI/Textfield";
import FormButton from "../../components/FormsUI/Button";

const EditOrder = ({
  setOpenEdit,
  editOrder,
  setClientOrders,
  clientOrders,
  clients,
}) => {
  const [clientId, setClientId] = useState(editOrder[0].client_id);
  const [name, setName] = useState(editOrder[0].client_name);
  const [status, setStatus] = useState({
    id: editOrder[0].status_id,
    name: editOrder[0].status_name,
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [disabled, setDisabled] = useState(false);

  const order_statuses = [
    {
      id: "1",
      name: "created",
    },
    {
      id: "2",
      name: "blocked",
    },
    {
      id: "3",
      name: "dispatched",
    },
    {
      id: "4",
      name: "delivered",
    },
    {
      id: "5",
      name: "cancelled",
    },
  ];

  const payment_statuses = [
    {
      name: "Not paid",
    },
    {
      name: "Partial",
    },
    {
      name: "Paid",
    },
  ];

  const handleSubmit = async (e) => {
    setDisabled(true);
    e.preventDefault();
    try {
      await warehousedb.put(`/api/v1/client_orders/${editOrder[0].order_id}`, {
        client_id: clientId,
        status_id: status.id,
        status_name: status.name,
      });
      const index = clientOrders.findIndex(
        (order) => order.order_id === editOrder[0].order_id
      );
      clientOrders[index].client_id = clientId;
      clientOrders[index].client_name = name;
      clientOrders[index].status_id = status.id;
      clientOrders[index].status_name = status.name;

      setClientOrders(clientOrders);

      setOpenEdit(false);
    } catch (err) {
      console.log(err);
      setDisabled(false);
    }
  };

  const handleNameChange = (e) => {
    const selectedClient = clients.find(
      (client) => client.client_id === e.target.value
    );
    setName(selectedClient.name);
    setClientId(e.target.value);
    // console.log("im the client: ", name, clientId);
  };

  const handleStatusChange = (e) => {
    const selectedStatus = order_statuses.find(
      (status) => status.id === e.target.value
    );
    setStatus(selectedStatus);
    // console.log("im the client: ", status);
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
            Edit Order <form action="" method="post"></form>
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 5,
            }}
          >
            <Grid
              container
              spacing={1}
              sx={{
                width: 300,
              }}
            >
              <Grid item xs={12}>
                <FormTextField
                  select
                  label="Change Client"
                  value={clientId}
                  // helperText="Please select your client"
                  onChange={handleNameChange}
                >
                  {clients &&
                    clients.map((client) => {
                      return (
                        <MenuItem
                          key={client.client_id}
                          value={client.client_id}
                        >
                          {client.name}
                        </MenuItem>
                      );
                    })}
                </FormTextField>
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  select
                  label="Change Status"
                  value={status.id}
                  // helperText="Please select your client"
                  onChange={handleStatusChange}
                >
                  {order_statuses &&
                    order_statuses.map((order_status) => {
                      return (
                        <MenuItem key={order_status.id} value={order_status.id}>
                          {order_status.name}
                        </MenuItem>
                      );
                    })}
                </FormTextField>
              </Grid>
            </Grid>
            <FormButton disabled={disabled}>SUBMIT</FormButton>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default EditOrder;

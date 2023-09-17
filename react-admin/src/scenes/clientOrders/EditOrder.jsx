import React, { useEffect, useRef, useState } from "react";
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
  selectAddresses,
}) => {
  const effectRan = useRef(false);
  const [address, setAddress] = useState(
    JSON.stringify({
      delivery_address_id: editOrder[0].delivery_address_id,
      address_name: editOrder[0].address_name,
      client_address: editOrder[0].client_address,
    })
  );
  const [status, setStatus] = useState({
    id: editOrder[0].status_id,
    name: editOrder[0].status_name,
  });
  // console.log("its me: ", selectAddresses);

  const [paymentStatus, setPaymentStatus] = useState(
    editOrder[0].payment_status
  );
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [disabled, setDisabled] = useState(false);

  // console.log(editOrder);
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
    const jsonAddress = JSON.parse(address);
    setDisabled(true);
    e.preventDefault();
    try {
      await warehousedb.put(`/api/v1/client_orders/${editOrder[0].order_id}`, {
        delivery_address_id: jsonAddress.delivery_address_id,
        status_id: status.id,
        status_name: status.name,
        payment_status: paymentStatus,
      });

      const index = clientOrders.findIndex(
        (order) => order.order_id === editOrder[0].order_id
      );
      clientOrders[index].delivery_address_id = jsonAddress.delivery_address_id;
      clientOrders[index].client_address = jsonAddress.client_address;
      clientOrders[index].status_id = status.id;
      clientOrders[index].status_name = status.name;
      clientOrders[index].payment_status = paymentStatus;

      setClientOrders(clientOrders);

      setOpenEdit(false);
    } catch (err) {
      console.log(err);
      setDisabled(false);
    }
  };

  const handleStatusChange = (e) => {
    const selectedStatus = order_statuses.find(
      (status) => status.id === e.target.value
    );
    setStatus(selectedStatus);
  };

  const handlePaymentStatusChange = (e) => {
    setPaymentStatus(e.target.value);
  };

  useEffect(() => {
    return () => {
      effectRan.current = true;
    };
  }, []);

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
                  label="Change Address"
                  defaultValue=""
                  // only set addressId when component is fully mounted
                  // so that no key/value error shows up
                  value={effectRan.current ? address : ""}
                  // helperText="Please select your client"
                  onChange={(e) => setAddress(e.target.value)}
                >
                  {selectAddresses &&
                    selectAddresses.map((address) => {
                      return (
                        <MenuItem
                          key={address.delivery_address_id}
                          // value={address.delivery_address_id}
                          value={JSON.stringify({
                            delivery_address_id: address.delivery_address_id,
                            address_name: address.name,
                            client_address: address.address,
                          })}
                        >
                          {address.name}
                        </MenuItem>
                      );
                    })}
                </FormTextField>
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  select
                  label="Status"
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
                <FormTextField
                  select
                  label="Payment"
                  value={paymentStatus}
                  // helperText="Please select your client"
                  onChange={handlePaymentStatusChange}
                >
                  {payment_statuses &&
                    payment_statuses.map((payment_status) => {
                      return (
                        <MenuItem
                          key={payment_status.name}
                          value={payment_status.name}
                        >
                          {payment_status.name}
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

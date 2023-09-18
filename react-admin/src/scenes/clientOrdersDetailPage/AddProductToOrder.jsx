import React, { useState, useContext } from "react";
import { WarehouseContext } from "../../context/WarehouseContext";
import warehousedb from "../../apis/Warehousedb";
import { Box, Container, TextField, Typography, MenuItem } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import FormTextField from "../../components/FormsUI/Textfield";
import FormButton from "../../components/FormsUI/Button";
// import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddProductToOrder = ({ setOpenAdd, products, setProducts, orderId }) => {
  // const { id } = useParams();

  const [productId, setProductId] = useState("");
  const [productRefId, setProductRefId] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [imageJson, setImageJson] = useState("");
  const [boxQuantity, setBoxQuantity] = useState("");
  const [pieceSellPrice, setPieceSellPrice] = useState("");
  const { addProductsOrder } = useContext(WarehouseContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [disabled, setDisabled] = useState(false);

  // console.log(products.length !== 0);
  // console.log(products[0]);
  // console.log(clients);
  const handleSubmit = async (e) => {
    setDisabled(true);
    e.preventDefault();
    try {
      const response = await warehousedb.post(
        `/api/v1/client_order_details/${orderId}/addProduct`,
        {
          product_id: productId,
          box_quantity: boxQuantity,
          piece_sell_price: pieceSellPrice,
        },
        {
          headers: { token: localStorage.token },
        }
      );
      // console.log(response.data.data.product);
      // console.log(addProductsOrder);
      response.data.data.product.product_reference_id = productRefId;
      response.data.data.product.image_json = imageJson;
      addProductsOrder(response.data.data.product);

      const index = products.findIndex(
        (product) => product.product_id === productId
      );
      products[index].current_box_quantity = productQuantity - boxQuantity;

      setProducts(products);

      setOpenAdd(false);
    } catch (err) {
      toast.error(err.response.data.message);
      // console.log(err.response.data.message);
      setDisabled(false);
    }
  };

  const handleNameChange = (e) => {
    const selectedProduct = products.find(
      (product) => product.product_id === e.target.value
    );
    setProductId(e.target.value);
    setProductRefId(selectedProduct.product_reference_id);
    setImageJson(selectedProduct.image_json);
    setProductQuantity(selectedProduct.current_box_quantity);
    // console.log("im the client: ", name, clientId);
  };

  // console.log(pieceSellPrice);

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
            Add new product to order {orderId}{" "}
            <form action="" method="post"></form>
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
              label="Select product ref id"
              defaultValue=""
              helperText="Please select your product"
              onChange={handleNameChange}
            >
              {products &&
                products.map((product) => {
                  return (
                    <MenuItem
                      key={product.product_id}
                      value={product.product_id}
                    >
                      {product.product_reference_id}
                    </MenuItem>
                  );
                })}
            </TextField>
            <FormTextField
              id="Box Quantity"
              label="Box Quantity"
              name="Box Quantity"
              autoComplete="Box Quantity"
              type="number"
              error={
                boxQuantity > productQuantity ||
                boxQuantity <= 0 ||
                Math.floor(boxQuantity) != boxQuantity
              }
              helperText={`Available ${productQuantity} Boxes`}
              value={boxQuantity}
              onChange={(e) => setBoxQuantity(e.target.value)}
            />
            <FormTextField
              type="number"
              id="Piece Sell Price"
              label="Piece Sell Price"
              name="Piece Sell Price"
              autoComplete="Piece Sell Price"
              error={pieceSellPrice < 0}
              helperText={pieceSellPrice < 0 ? `must be greater than 0` : ""}
              value={pieceSellPrice}
              onChange={(e) => setPieceSellPrice(e.target.value)}
            />

            <FormButton
              disabled={
                boxQuantity > productQuantity ||
                boxQuantity <= 0 ||
                productQuantity <= 0 ||
                pieceSellPrice < 0 ||
                pieceSellPrice == "" ||
                Math.floor(boxQuantity) != boxQuantity
                  ? true
                  : disabled
              }
            >
              SUBMIT
            </FormButton>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AddProductToOrder;

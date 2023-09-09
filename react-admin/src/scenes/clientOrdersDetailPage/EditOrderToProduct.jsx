import React, { useState, useContext } from "react";
import { WarehouseContext } from "../../context/WarehouseContext";
import warehousedb from "../../apis/Warehousedb";
import {
  Box,
  Container,
  InputLabel,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
  MenuItem,
  Grid,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import FormTextField from "../../components/FormsUI/Textfield";
import FormButton from "../../components/FormsUI/Button";

const EditOrderToProduct = ({
  setOpenEdit,
  editOrderProduct,
  setOrderProducts,
  orderProducts,
  products,
  productQuantity,
  setProducts,
}) => {
  // const [productId, setProductId] = useState(editOrderProduct[0].product_id);
  // const [productRefId, setProductRefId] = useState(
  //   editOrderProduct[0].product_reference_id
  // );
  const [boxQuantity, setBoxQuantity] = useState(
    editOrderProduct[0].box_quantity
  );

  const [pieceSellPrice, setPieceSellPrice] = useState(
    parseFloat(editOrderProduct[0].piece_sell_price)
  );
  // const [imageJson, setImageJson] = useState(editOrderProduct[0].image_json);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = async (e) => {
    setDisabled(true);
    e.preventDefault();
    try {
      const results = await warehousedb.put(
        `/api/v1/client_order_details/${editOrderProduct[0].order_detail_id}`,
        {
          product_id: editOrderProduct[0].product_id,
          box_quantity: boxQuantity,
          piece_sell_price: pieceSellPrice,
          box_quantity_delta_change:
            editOrderProduct[0].box_quantity - boxQuantity,
        }
      );
      const index = orderProducts.findIndex(
        (orderProduct) =>
          orderProduct.order_detail_id === editOrderProduct[0].order_detail_id
      );
      // orderProducts[index].product_id = productId;
      // orderProducts[index].product_reference_id = productRefId;
      orderProducts[index].box_quantity = boxQuantity;
      orderProducts[index].piece_sell_price = pieceSellPrice;
      // orderProducts[index].image_json = imageJson;

      setOrderProducts(orderProducts);

      const i = products.findIndex(
        (product) => product.product_id === editOrderProduct[0].product_id
      );

      products[i].current_box_quantity =
        results.data.data.updated_current_box_quantity;

      setProducts(products);

      setOpenEdit(false);
    } catch (err) {
      console.log(err);
      setDisabled(false);
    }
  };

  // const handleProductIdChange = (e) => {
  //   const selectedProduct = products.find(
  //     (product) => product.product_id === e.target.value
  //   );
  //   setProductId(selectedProduct.product_id);
  //   setImageJson(selectedProduct.image_json);
  //   setProductRefId(selectedProduct.product_reference_id);
  //   setProductQuantity(selectedProduct.current_box_quantity);
  // };

  const handleProductPriceChange = (e) => {
    setPieceSellPrice(parseFloat(e.target.value));
    // console.log(e.target.value != editOrderProduct[0].piece_sell_price);
    if (e.target.value != parseFloat(editOrderProduct[0].piece_sell_price)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleProductBoxQuantityChange = (e) => {
    setBoxQuantity(e.target.value);
    // console.log(e.target.value != editOrderProduct[0].piece_sell_price);
    if (e.target.value != editOrderProduct[0].box_quantity) {
      setDisabled(false);
    } else {
      setDisabled(true);
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
            {/* <TextField
              select
              fullWidth
              label="Select product ref id"
              value={productId}
              helperText="Please select your product"
              onChange={handleProductIdChange}
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
            </TextField> */}
            <FormTextField
              id="standard-read-only-input"
              label="Product Ref ID (not editable)"
              name="Product Ref ID"
              autoComplete="Product Ref ID"
              value={editOrderProduct[0].product_reference_id}
              InputProps={{
                readOnly: true,
              }}
            />

            <FormTextField
              id="Box Quantity"
              label="Box Quantity"
              name="Box Quantity"
              autoComplete="Box Quantity"
              error={
                boxQuantity >
                  productQuantity +
                    parseFloat(editOrderProduct[0].box_quantity) ||
                boxQuantity <= 0
              }
              value={boxQuantity}
              helperText={`Available ${
                // available boxes of product + initial ordered product quantity
                productQuantity + parseFloat(editOrderProduct[0].box_quantity)
              } Boxes`}
              onChange={handleProductBoxQuantityChange}
            />
            <FormTextField
              id="Piece Sell Price"
              label="Piece Sell Price"
              name="Piece Sell Price"
              autoComplete="Piece Sell Price"
              value={pieceSellPrice}
              onChange={handleProductPriceChange}
              type="number"
            />
            <FormButton
              disabled={
                boxQuantity >
                  productQuantity +
                    parseFloat(editOrderProduct[0].box_quantity) ||
                boxQuantity <= 0
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

export default EditOrderToProduct;

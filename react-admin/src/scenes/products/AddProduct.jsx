import React, { useState, useContext } from "react";
import { WarehouseContext } from "../../context/WarehouseContext";
import warehousedb from "../../apis/Warehousedb";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import FormTextField from "../../components/FormsUI/Textfield";
import FormButton from "../../components/FormsUI/Button";

const AddProduct = ({ setOpenAdd }) => {
  const { addProducts } = useContext(WarehouseContext);
  const [ProductReferenceId, setProductReferenceId] = useState("");
  const [productName, setProductName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [subTypeId, setSubTypeId] = useState("");
  const [FactoryId, setFactoryId] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [currentBoxQuantity, setCurrentBoxQuantity] = useState("");
  const [packPerBox, setPackPerBox] = useState("");
  const [piecesPerPack, setPiecesPerPack] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [productImg, setProductImg] = useState();
  const [disabled, setDisabled] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    TransformFile(file);
  };

  const TransformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductImg(reader.result);
      };
    } else {
      setProductImg();
    }
  };

  const handleSubmit = async (e) => {
    setDisabled(true);
    e.preventDefault();
    try {
      const response = await warehousedb.post(
        "/api/v1/products",
        {
          product_reference_id: ProductReferenceId,
          product_name: productName,
          type_id: typeId,
          sub_type_id: subTypeId,
          factory_id: FactoryId,
          unit_cost: unitCost,
          current_box_quantity: currentBoxQuantity,
          pack_per_box: packPerBox,
          pieces_per_pack: piecesPerPack,
          productImg,
        },
        {
          headers: { token: localStorage.token },
        }
      );
      // console.log(response.data.data);
      addProducts(response.data.data.product);
      setOpenAdd(false);
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
          <PlaylistAddIcon
            sx={{ m: 1, bgcolor: colors.greenAccent[700], borderRadius: "8px" }}
          />
          <Typography component="h1" variant="h5">
            Add new product <form action="" method="post"></form>
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 1,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormTextField
                  id="ProductReferenceId"
                  label="ProductReferenceId"
                  name="ProductReferenceId"
                  autoComplete="ProductReferenceId"
                  value={ProductReferenceId}
                  onChange={(e) => setProductReferenceId(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormTextField
                  id="productName"
                  label="productName"
                  name="productName"
                  autoComplete="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormTextField
                  id="typeId"
                  label="typeId"
                  name="typeId"
                  autoComplete="typeId"
                  type="number"
                  value={typeId}
                  onChange={(e) => setTypeId(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormTextField
                  id="subTypeId"
                  label="subTypeId"
                  name="subTypeId"
                  autoComplete="subTypeId"
                  type="number"
                  value={subTypeId}
                  onChange={(e) => setSubTypeId(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormTextField
                  id="FactoryId"
                  label="FactoryId"
                  name="FactoryId"
                  autoComplete="FactoryId"
                  type="number"
                  value={FactoryId}
                  onChange={(e) => setFactoryId(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormTextField
                  id="unitCost"
                  label="unitCost"
                  name="unitCost"
                  autoComplete="unitCost"
                  type="number"
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormTextField
                  id="currentBoxQuantity"
                  label="currentBoxQuantity"
                  name="currentBoxQuantity"
                  autoComplete="currentBoxQuantity"
                  type="number"
                  value={currentBoxQuantity}
                  onChange={(e) => setCurrentBoxQuantity(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormTextField
                  id="packPerBox"
                  label="packPerBox"
                  name="packPerBox"
                  autoComplete="packPerBox"
                  type="number"
                  value={packPerBox}
                  onChange={(e) => setPackPerBox(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormTextField
                  id="piecesPerPack"
                  label="piecesPerPack"
                  name="piecesPerPack"
                  autoComplete="piecesPerPack"
                  type="number"
                  value={piecesPerPack}
                  onChange={(e) => setPiecesPerPack(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <input type="file" onChange={handleFileChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <img
                      src={productImg}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <FormButton disabled={disabled}>
                {!disabled ? (
                  "SUBMIT"
                ) : (
                  <div>
                    <img
                      src="../assets/loading.gif"
                      style={{ width: "20px" }}
                    />
                  </div>
                )}
              </FormButton>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AddProduct;

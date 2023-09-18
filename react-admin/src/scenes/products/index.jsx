import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { WarehouseContext } from "../../context/WarehouseContext";
import warehousedb from "../../apis/Warehousedb";
import { useContext, useEffect, useState } from "react";
import AddProduct from "./AddProduct";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import EditProduct from "./EditProduct";

const Products = ({ setAuth }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { products, setProducts } = useContext(WarehouseContext);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editProduct, setEditProduct] = useState([]);
  const columns = [
    {
      field: "product_id",
      headerName: "ID",
      cellClassName: "name-column--cell",
      flex: 1,
      editable: true,
    },
    {
      field: "product_reference_id",
      headerName: "Ref ID",
      editable: true,
      flex: 1,
    },
    {
      field: "product_name",
      headerName: "Name",
      flex: 1,
      editable: true,
    },
    { field: "type_id", headerName: "type id", flex: 1, editable: true },
    {
      field: "sub_type_id",
      headerName: "Sub-type id",
      flex: 1,
      editable: true,
    },
    { field: "factory_id", headerName: "factory id", flex: 1, editable: true },
    { field: "unit_cost", headerName: "Unit Cost", flex: 1, editable: true },
    {
      field: "current_box_quantity",
      headerName: "Box Quantity",
      editable: true,
      flex: 1,
    },
    {
      field: "pack_per_box",
      headerName: "Pack per box",
      editable: true,
      flex: 1,
    },
    {
      field: "pieces_per_pack",
      headerName: "Pieces per pack",
      editable: true,
      flex: 1,
    },
    {
      field: "image_json",
      headerName: "Image",
      editable: true,
      flex: 3,
      renderCell: (params) => {
        return (
          <>
            {params.value ? (
              <img
                src={params.value.url ? params.value.url : params.value}
                style={{
                  alignSelf: "center",
                  height: "100%",
                }}
              />
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      field: "deleteButton",
      headerName: "Actions",
      description: "Actions column.",
      sortable: false,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <>
            <Stack spacing={2} direction="row">
              <Tooltip title="Edit product" arrow>
                <Button
                  // onClick={(e) => onEdit(e, params.row)}
                  onClick={(e) => onEdit(e, params.row)}
                  variant="contained"
                  sx={{
                    minWidth: "20px",
                    bgcolor: colors.greenAccent[700],
                    color: "white",
                    ":hover": {
                      bgcolor: colors.blueAccent[700], // theme.palette.primary.main
                      color: "white",
                    },
                  }}
                >
                  <SaveAsIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Delete product" arrow>
                <Button
                  onClick={(e) => onDelete(e, params.row)}
                  variant="contained"
                  sx={{
                    minWidth: "20px",
                    bgcolor: colors.greenAccent[700],
                    color: "white",
                    ":hover": {
                      bgcolor: colors.blueAccent[700], // theme.palette.primary.main
                      color: "white",
                    },
                  }}
                >
                  <DeleteForeverIcon />
                </Button>
              </Tooltip>
            </Stack>
          </>
        );
      },
    },
  ];

  const onDelete = async (e, selectedProduct) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete "${selectedProduct.product_name}"?`
      )
    ) {
      try {
        await warehousedb.delete(
          `/api/v1/products/${selectedProduct.product_id}`
        );
        toast.warn(
          `Product "${selectedProduct.product_name}" has been deleted`
        );
        setProducts(
          products.filter((product) => {
            return product.product_id !== selectedProduct.product_id;
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onEdit = (e, row) => {
    var product = products.filter((product) => {
      return product.product_id === row.product_id;
    });
    setEditProduct(product);
    // console.log(client);
    e.preventDefault();
    setOpenEdit(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responce = await warehousedb.get("/api/v1/products", {
          headers: { token: localStorage.token },
        });

        //    console.log("new json: " ,responce.data.data.orders.length !== 0 )

        setProducts(responce.data.data.products);
      } catch (err) {
        localStorage.removeItem("token");
        setAuth(false);
        setProducts([]);
        console.log(err);
      }
    };

    fetchData();
  }, [setProducts, setAuth]);

  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between">
        <Header title="Prodcuts" subtitle="List of your products" />
        <Button
          onClick={() => setOpenAdd(true)}
          sx={{
            m: 4,
            bgcolor: colors.greenAccent[700],
            ":hover": {
              bgcolor: colors.blueAccent[700], // theme.palette.primary.main
              color: "white",
            },
          }}
        >
          <Tooltip title="Add new product" arrow>
            <AddIcon />
          </Tooltip>
        </Button>
        <Dialog
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          sx={{
            ".css-1qxadfk-MuiPaper-root-MuiDialog-paper": {
              backgroundColor: colors.primary[500],
            },
          }}
        >
          <DialogContent>
            <AddProduct setOpenAdd={setOpenAdd} />
          </DialogContent>
        </Dialog>

        <Dialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          sx={{
            ".css-1qxadfk-MuiPaper-root-MuiDialog-paper": {
              backgroundColor: colors.primary[500],
            },
          }}
        >
          <DialogContent>
            <EditProduct
              setOpenEdit={setOpenEdit}
              editProduct={editProduct}
              setProducts={setProducts}
              products={products}
            />
          </DialogContent>
        </Dialog>
      </Box>
      <Box
        m="10px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            rowHeight: "168px !important",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          getRowId={(row) => row.product_id}
          rows={products}
          columns={columns}
          rowHeight={150}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default Products;

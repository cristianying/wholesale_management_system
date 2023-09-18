import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Hidden,
  Stack,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { WarehouseContext } from "../../context/WarehouseContext";
import warehousedb from "../../apis/Warehousedb";
import { useContext, useState } from "react";
// import AddClient from "./AddClient";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
import AddOrderToProduct from "./AddProductToOrder";
import EditOrderToProduct from "./EditOrderToProduct";
import AddIcon from "@mui/icons-material/Add";

const ClientOrdersDetailPage = ({ orderId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const effectRan = useRef(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editOrderProduct, setEditOrderProduct] = useState([]);
  const [productQuantity, setProductQuantity] = useState();
  // const { id } = useParams();
  const { orderProducts, setOrderProducts } = useContext(WarehouseContext);
  const { products, setProducts } = useContext(WarehouseContext);

  const onDelete = async (e, selectedProduct) => {
    e.stopPropagation();
    // console.log(selectedProduct);
    if (
      window.confirm(
        `Are you sure you want to delete "${selectedProduct.product_id}"?`
      )
    ) {
      try {
        const results = await warehousedb.delete(
          `/api/v1/client_order_details/${selectedProduct.order_detail_id}`,
          {
            data: {
              product_id: selectedProduct.product_id,
              product_order_delete_quantity: selectedProduct.box_quantity,
            },
          }
        );

        toast.warn(
          `Product "${selectedProduct.product_id}" has been deleted from order`
        );

        setOrderProducts(
          orderProducts.filter((orderProduct) => {
            return (
              orderProduct.order_detail_id !== selectedProduct.order_detail_id
            );
          })
        );

        const i = products.findIndex(
          (product) => product.product_id === selectedProduct.product_id
        );

        products[i].current_box_quantity =
          results.data.data.updated_current_box_quantity;

        setProducts(products);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onEdit = (e, row) => {
    const orderProduct = orderProducts.filter((orderProduct) => {
      return orderProduct.order_detail_id === row.order_detail_id;
    });

    const selectedProduct = products.filter((product) => {
      return product.product_id === row.product_id;
    });
    setEditOrderProduct(orderProduct);
    setProductQuantity(selectedProduct[0].current_box_quantity);
    // console.log(order);
    e.preventDefault();
    setOpenEdit(true);
  };

  // useEffect(() => {
  // since use effect runs twice, this will stop it from running as it will be set to false when it unmounts
  // if (effectRan.current === false) {
  // const fetchData = async () => {
  // try {
  //   const order_details = await warehousedb.get(
  //     `/api/v1/client_order_details/${id}`,
  //     {
  //       headers: { token: localStorage.token },
  //     }
  //   );

  // if (products.length === 0) {
  // const products = await warehousedb.get("/api/v1/products", {
  // headers: { token: localStorage.token },
  // });
  // }
  // console.log(order_details.data.data.order_products);
  // setOrderProducts(order_details.data.data.order_products);
  //   setProducts(products.data.data.products);
  // } catch (err) {
  //   localStorage.removeItem("token");
  //   setAuth(false);
  //   console.log(err);
  // }
  // };

  // fetchData();
  //   return () => {
  //     effectRan.current = true;
  //   };
  // }
  // }, [orderId, setOrderProducts]);

  const columns = [
    {
      field: "product_id",
      headerName: "Product ID",
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "product_reference_id",
      headerName: "Ref ID",
      flex: 1,
      editable: true,
    },
    {
      field: "box_quantity",
      headerName: "Boxes",
      flex: 1,
      editable: true,
    },
    {
      field: "piece_sell_price",
      headerName: "Unit Price",
      flex: 1,
      editable: true,
    },
    {
      field: "image_json",
      headerName: "Image",
      editable: true,
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {params.value ? (
              <img
                src={params.value.url ? params.value.url : params.value}
                style={{
                  justifyContent: "center",
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
      // flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            <Stack spacing={1} direction="column">
              <Tooltip title="Edit product" arrow>
                <Button
                  onClick={(e) => {
                    e.ignore = true;
                    onEdit(e, params.row);
                  }}
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
  // console.log(orderId.length == 0);

  return (
    <Box ml="10px">
      <Box display="flex" justifyContent="space-between">
        <Header title={"#" + orderId} subtitle="Ordered products details" />
        <Button
          onClick={() => setOpenAdd(true)}
          sx={{
            m: 4,
            visibility: orderId.length == 0 ? "hidden" : "visible",
            bgcolor: colors.greenAccent[700],
            ":hover": {
              bgcolor: colors.blueAccent[700], // theme.palette.primary.main
              color: "white",
            },
          }}
        >
          <Tooltip title="Add new product to order" arrow>
            <AddIcon />
          </Tooltip>
        </Button>
        <Dialog
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          sx={{
            ".css-1qxadfk-MuiPaper-root-MuiDialog-paper": {
              backgroundColor: colors.primary[500],
            },
          }}
        >
          <DialogContent>
            <AddOrderToProduct
              setOpenAdd={setOpenAdd}
              products={products}
              setProducts={setProducts}
              orderId={orderId}
            />
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
            <EditOrderToProduct
              setOpenEdit={setOpenEdit}
              editOrderProduct={editOrderProduct}
              setOrderProducts={setOrderProducts}
              orderProducts={orderProducts}
              products={products}
              productQuantity={productQuantity}
              setProductQuantity={setProductQuantity}
              setProducts={setProducts}
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          getRowId={(row) => row.order_detail_id}
          rows={orderProducts}
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

export default ClientOrdersDetailPage;

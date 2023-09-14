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
import { useContext, useEffect, useRef, useState } from "react";
import AddOrder from "./AddOrder";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
// import { useNavigate } from "react-router-dom";
import EditOrder from "./EditOrder";
import ClientOrdersDetailPage from "../clientOrdersDetailPage";
import AddIcon from "@mui/icons-material/Add";

const ClientOrders = ({ setAuth }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { clientOrders, setClientOrders } = useContext(WarehouseContext);
  const { clients, setClients } = useContext(WarehouseContext);
  const { setOrderProducts } = useContext(WarehouseContext);
  const { setProducts } = useContext(WarehouseContext);
  const effectRan = useRef(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editOrder, setEditOrder] = useState([]);
  const [orderId, setOrderId] = useState([]);
  // let navigate = useNavigate();

  // console.log(clientOrders[0].order_id);
  const onDelete = async (e, selectedOrder) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete order ${selectedOrder.order_id}?`
      )
    ) {
      try {
        await warehousedb.delete(
          `/api/v1/client_orders/${selectedOrder.order_id}`
        );
        toast.warn(`Client "${selectedOrder.order_id}" has been deleted`);
        setClientOrders(
          clientOrders.filter((order) => {
            return order.order_id !== selectedOrder.order_id;
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onEdit = (e, row) => {
    var order = clientOrders.filter((order) => {
      return order.order_id === row.order_id;
    });
    setEditOrder(order);
    // console.log(order);
    e.preventDefault();
    setOpenEdit(true);
  };

  useEffect(() => {
    // since use effect runs twice, this will stop it from running as it will be set to false when it unmounts
    if (effectRan.current === false) {
      setOrderProducts([]);

      const fetchData = async () => {
        try {
          const responce = await warehousedb.get("/api/v1/client_orders", {
            headers: { token: localStorage.token },
          });
          if (responce.data.data.orders.length !== 0) {
            // console.log(
            //   new Date(
            //     responce.data.data.orders[0].created_at
            //   ).toLocaleDateString()
            // );

            setClientOrders(responce.data.data.orders);
          }

          setClients(responce.data.data.clients);
        } catch (err) {
          localStorage.removeItem("token");
          setAuth(false);
          console.log(err);
        }
      };

      fetchData();
      return () => {
        effectRan.current = true;
      };
    }
  }, [setAuth, setClientOrders, orderId]);

  const columns = [
    {
      field: "order_id",
      headerName: "ID",
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "client_name",
      headerName: "Client",
      flex: 1,
      editable: true,
    },
    {
      field: "created_at",
      headerName: "Created at",
      flex: 2,
      editable: true,
    },
    // {
    //   field: "updated_at",
    //   headerName: "updated_at",
    //   flex: 2,
    //   editable: true,
    // },
    { field: "status_name", headerName: "Status", flex: 0.8, editable: true },
    {
      field: "deleteButton",
      headerName: "Actions",
      description: "Actions column.",
      sortable: false,
      minWidth: 130,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <>
            <Stack spacing={1} direction="row">
              <Tooltip title="Save Changes" arrow>
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
              <Tooltip title="Delete Record" arrow>
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

  const handleRowClick = (params) => {
    // console.log(params);
    // navigate(`/client_order_detail_page/${params.row.order_id}`);
    setOrderId(params.row.order_id);
    const fetchData = async () => {
      try {
        const order_details = await warehousedb.get(
          `/api/v1/client_order_details/${params.row.order_id}`,
          {
            headers: { token: localStorage.token },
          }
        );

        // if (products.length === 0) {
        const products = await warehousedb.get("/api/v1/products", {
          headers: { token: localStorage.token },
        });
        // }
        // console.log(order_details.data.data.order_products);
        setOrderProducts(order_details.data.data.order_products);
        setProducts(products.data.data.products);
      } catch (err) {
        localStorage.removeItem("token");
        setAuth(false);
        console.log(err);
      }
    };

    fetchData();
  };

  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box sx={{ flexGrow: 1, overflow: "clip" }}>
          <Box display="flex" justifyContent="space-between">
            <Header title="Orders" subtitle="List of your Clients' Orders" />
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
              <Tooltip title="Add new order" arrow>
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
                <AddOrder setOpenAdd={setOpenAdd} clients={clients} />
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
                <EditOrder
                  setOpenEdit={setOpenEdit}
                  editOrder={editOrder}
                  setClientOrders={setClientOrders}
                  clientOrders={clientOrders}
                  clients={clients}
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
              getRowId={(row) => row.order_id}
              rows={clientOrders}
              columns={columns}
              components={{
                Toolbar: GridToolbar,
              }}
              onRowClick={(params, e) => {
                // console.log(e);
                if (!e.ignore) {
                  handleRowClick(params);
                }
              }}
            />
          </Box>
        </Box>

        <Box sx={{ flexGrow: 2, overflow: "clip" }}>
          <ClientOrdersDetailPage orderId={orderId} />
        </Box>
      </Box>
    </Box>
  );
};

export default ClientOrders;

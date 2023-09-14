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
import AddClientAddress from "./AddClientAddress";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import EditClientAddress from "./EditClientAddress";

const ClientAddresses = ({ setAuth }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { clients, setClients } = useContext(WarehouseContext);
  const { clientAddresses, setClientAddresses } = useContext(WarehouseContext);
  const effectRan = useRef(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editClientAddress, setEditClientAddress] = useState([]);

  //   https://stackoverflow.com/questions/70951533/custom-edit-and-delete-components-on-row-datagrid-mui-v5-component-hovered
  const onDelete = async (e, selectedAddress) => {
    e.stopPropagation();
    // console.log(selectedAddress);
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedAddress.client_name}'s address?`
      )
    ) {
      try {
        await warehousedb.delete(
          `/api/v1/client_addresses/${selectedAddress.delivery_address_id}`
        );
        toast.warn(
          `Client ${selectedAddress.client_name}'s address has been deleted`
        );
        setClientAddresses(
          clientAddresses.filter((address) => {
            return (
              address.delivery_address_id !==
              selectedAddress.delivery_address_id
            );
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onEdit = (e, row) => {
    var clientAddress = clientAddresses.filter((clientAddress) => {
      return clientAddress.delivery_address_id === row.delivery_address_id;
    });
    setEditClientAddress(clientAddress);
    // console.log(clientAddress);
    e.preventDefault();
    setOpenEdit(true);
  };

  useEffect(() => {
    // since use effect runs twice, this will stop it from running as it will be set to false when it unmounts
    if (effectRan.current === false) {
      const fetchData = async () => {
        try {
          const client_addresses = await warehousedb.get(
            "/api/v1/client_addresses",
            {
              headers: { token: localStorage.token },
            }
          );
          const res = await warehousedb.get("/api/v1/clients", {
            headers: { token: localStorage.token },
          });

          setClientAddresses(client_addresses.data.data.client_addresses);
          setClients(res.data.data.client);
          // console.log(clientAddresses);
        } catch (err) {
          console.log(err);
          localStorage.removeItem("token");
          setAuth(false);
        }
      };
      fetchData();
      return () => {
        effectRan.current = true;
      };
    }
  }, [setAuth, setClientAddresses]);

  const columns = [
    {
      field: "client_name",
      headerName: "Client Name",
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "name",
      headerName: "Address Name",
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    { field: "email", headerName: "email", flex: 1, editable: true },
    {
      field: "address",
      headerName: "address",
      flex: 1,
      editable: true,
    },
    { field: "country", headerName: "country", flex: 0.5, editable: true },
    { field: "telephone", headerName: "telephone", flex: 0.5, editable: true },
    { field: "note", headerName: "note", flex: 1, editable: true },
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
              <Tooltip title="Save Changes" arrow>
                <Button
                  // onClick={() => setOpenEdit(true)}
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

  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Clients Addresses"
          subtitle="List of your Clients Addresses"
        />
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
          <Tooltip title="Add new client" arrow>
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
            <AddClientAddress
              setOpenAdd={setOpenAdd}
              clients={clients}
              setClientAddresses={setClientAddresses}
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
            <EditClientAddress
              setOpenEdit={setOpenEdit}
              editClientAddress={editClientAddress}
              setClientAddresses={setClientAddresses}
              clientAddresses={clientAddresses}
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
          getRowId={(row) => row.delivery_address_id}
          rows={clientAddresses}
          columns={columns}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default ClientAddresses;

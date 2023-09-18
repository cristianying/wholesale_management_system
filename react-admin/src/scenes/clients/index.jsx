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
import AddClient from "./AddClient";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import EditClient from "./EditClient";

const Contacts = ({ setAuth }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { clients, setClients } = useContext(WarehouseContext);
  const effectRan = useRef(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editClient, setEditClient] = useState([]);

  //   https://stackoverflow.com/questions/70951533/custom-edit-and-delete-components-on-row-datagrid-mui-v5-component-hovered
  const onDelete = async (e, selectedClient) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete "${selectedClient.name}"?`
      )
    ) {
      try {
        await warehousedb.delete(`/api/v1/clients/${selectedClient.client_id}`);
        toast.warn(`Client "${selectedClient.name}" has been deleted`);
        setClients(
          clients.filter((client) => {
            return client.client_id !== selectedClient.client_id;
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onEdit = (e, row) => {
    var client = clients.filter((client) => {
      return client.client_id === row.client_id;
    });
    setEditClient(client);
    // console.log(client);
    e.preventDefault();
    setOpenEdit(true);

    // try {
    //   if (
    //     row.name !== client[0].name ||
    //     row.email !== client[0].email ||
    //     row.telephone !== client[0].telephone ||
    //     row.email !== client[0].email ||
    //     row.address !== client[0].address ||
    //     row.country !== client[0].country ||
    //     row.note !== client[0].note
    //   ) {
    //     await warehousedb.put(`/api/v1/clients/${row.client_id}`, {
    //       name: row.name,
    //       email: row.email,
    //       telephone: row.telephone,
    //       address: row.address,
    //       country: row.country,
    //       note: row.note,
    //     });
    //     row.name = client[0].name;
    //     row.email = client[0].email;
    //     row.telephone = client[0].telephone;
    //     row.email = client[0].email;
    //     row.country = client[0].country;
    //     row.note = client[0].note;
    //     toast("Your changes have beeen saved");
    //   } else {
    //     toast.warn("You have not made any changes");
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  useEffect(() => {
    // since use effect runs twice, this will stop it from running as it will be set to false when it unmounts
    if (effectRan.current === false) {
      const fetchData = async () => {
        try {
          const responce = await warehousedb.get("/api/v1/clients", {
            headers: { token: localStorage.token },
          });

          setClients(responce.data.data.client);
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
  }, [setAuth, setClients]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
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
              <Tooltip title="Edit Client" arrow>
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
              <Tooltip title="Delete Client" arrow>
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
        <Header title="Clients" subtitle="List of your Clients" />
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
            <AddClient setOpenAdd={setOpenAdd} />
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
            <EditClient
              setOpenEdit={setOpenEdit}
              editClient={editClient}
              setClients={setClients}
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
          getRowId={(row) => row.client_id}
          rows={clients}
          columns={columns}
          rowHeight={70}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;

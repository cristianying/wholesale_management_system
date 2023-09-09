import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Products from "./scenes/products";
// import Bar from "./scenes/bar";
// import Form from "./scenes/form";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Clients from "./scenes/clients/index.jsx";
import { WarehouseContextProvider } from "./context/WarehouseContext";
import Login from "./scenes/Login";
import { useEffect, useState } from "react";
import warehousedb from "./apis/Warehousedb";
import Register from "./scenes/Register";
// import Calendar from "./scenes/calendar/calendar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientOrders from "./scenes/clientOrders";
import ClientOrdersDetailPage from "./scenes/clientOrdersDetailPage";

function App() {
  const [theme, colorMode] = useMode();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/register";

  const isAuth = async () => {
    try {
      //console.log("localStorage.token: ", !!localStorage.token);

      if (localStorage.token) {
        const res = await warehousedb.get("/auth/is-verify", {
          headers: { token: localStorage.token },
        });

        // console.log("new json: ", res);

        const parseRes = await res.data;

        parseRes === true
          ? setIsAuthenticated(true)
          : setIsAuthenticated(false);
      }
      setMounted(true);
    } catch (error) {
      console.error(error.message);
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    isAuth();
  }, []);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };
  if (mounted) {
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <WarehouseContextProvider>
            <CssBaseline />
            <div className="app">
              {!isLoginPage && <Sidebar />}
              <main className="content">
                {!isLoginPage && <Topbar setAuth={setAuth} />}
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/team" element={<Team />} />
                  <Route
                    path="/clients"
                    element={
                      !isAuthenticated ? (
                        <Navigate to="/login" />
                      ) : (
                        <Clients setAuth={setAuth} />
                      )
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      !isAuthenticated ? (
                        <Navigate to="/login" />
                      ) : (
                        <Products setAuth={setAuth} />
                      )
                    }
                  />
                  <Route path="/login" element={<Login setAuth={setAuth} />} />
                  <Route
                    path="/register"
                    element={<Register setAuth={setAuth} />}
                  />
                  <Route
                    path="/orders"
                    element={<ClientOrders setAuth={setAuth} />}
                  />
                  <Route
                    path="/client_order_detail_page/:id"
                    element={<ClientOrdersDetailPage setAuth={setAuth} />}
                  />
                  {/* <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} /> */}
                </Routes>
              </main>
            </div>
          </WarehouseContextProvider>
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss={false}
          rtl={false}
          draggable
          pauseOnHover={false}
          theme={theme.palette.mode}
        />
      </ColorModeContext.Provider>
    );
  } else {
    return <></>;
  }
}

export default App;

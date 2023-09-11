require("dotenv").config();
const express = require("express");
const cors = require("cors");
// import the db object
const db = require("./db");
const app = express();

// used to allow different sites to call our api
app.use(cors());
// middle ware is just a function between the request and response
// must call next to pass it to the next handler
app.use(express.json({ limit: "50mb" }));

//reigster and login routes
app.use("/auth", require("./routes/jwtAuth"));

// restaurants routes
app.use("/api/v1/restaurants", require("./routes/restaurants"));

// clients routes
app.use("/api/v1/clients", require("./routes/clients"));

// orders routes
app.use("/api/v1/client_orders", require("./routes/client_orders"));

// order details routes
app.use(
  "/api/v1/client_order_details",
  require("./routes/client_order_details")
);

// products routes
app.use("/api/v1/products", require("./routes/products"));

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`server is up and listening on port ${port}`);
});

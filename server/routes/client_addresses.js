const router = require("express").Router();
const db = require("../db/index.js");
const authorization = require("../middleware/authorization.js");

// get all client address
router.get("/", authorization, async (req, res) => {
  try {
    // console.log(req.params.id, req.user.id);
    const client_addresses = await db.query(
      "select a.*, c.name as client_name from client_delivery_addresses a left join clients c on a.client_id = c.client_id where a.user_id =$1;",
      [req.user.id]
    );

    // console.log(restaurant.rows[0]);
    res.status(200).json({
      status: "Success",
      data: {
        client_addresses: client_addresses.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// get specific client address
router.get("/:id", authorization, async (req, res) => {
  try {
    // console.log(req.params.id, req.user.id);
    const client_addresses = await db.query(
      "select a.*, c.name as client_name from client_delivery_addresses a left join clients c on a.client_id = c.client_id where a.user_id =$1;",
      [req.user.id]
    );

    // console.log(restaurant.rows[0]);
    res.status(200).json({
      status: "Success",
      data: {
        client_addresses: client_addresses.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// add address
router.post("/", authorization, async (req, res) => {
  // console.log(req.body);
  try {
    const newAddress = await db.query(
      "INSERT INTO client_delivery_addresses (user_id,client_id, name, email, telephone, address, country, note) VALUES ($1, $2 , $3, $4, $5, $6, $7, $8) returning *",
      [
        req.user.id,
        req.body.clientId,
        req.body.name,
        req.body.email,
        req.body.telephone,
        req.body.address,
        req.body.country,
        req.body.note,
      ]
    );

    res.status(200).json({
      status: "Success",
      data: {
        address: newAddress.rows[0],
      },
    });
  } catch (error) {
    // console.log(error);
  }
});

// update client order product
router.put("/:id", async (req, res) => {
  try {
    // sql injections protection
    const results = await db.query(
      "UPDATE client_delivery_addresses SET name = $1, email = $2, telephone = $3, address = $4, country = $5, note = $6 where delivery_address_id = $7 returning *",
      [
        req.body.name,
        req.body.email,
        req.body.telephone,
        req.body.address,
        req.body.country,
        req.body.note,
        req.params.id,
      ]
    );

    // console.log(results.rows[0]);
    res.status(200).json({
      status: "Success",
      data: {
        client_delivery_address: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// delete product
router.delete("/:id", async (req, res) => {
  // console.log(req.body.product_id);
  try {
    // sql injections protection
    const results = await db.query(
      "DELETE FROM client_delivery_addresses WHERE delivery_address_id = $1",
      [req.params.id]
    );

    // console.log(results.rows[0]);
    res.status(200).json({
      status: "Success",
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

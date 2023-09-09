const router = require("express").Router();
const db = require("../db/index.js");
const authorization = require("../middleware/authorization.js");

// get all orders
router.get("/", authorization, async (req, res) => {
  try {
    const orders = await db.query(
      "select o.*, c.name as client_name from client_orders o left join clients c on c.client_id = o.client_id where o.user_id=$1 order by 1 desc;",
      [req.user.id]
    );

    const clients = await db.query("select * from clients where user_id=$1", [
      req.user.id,
    ]);

    // console.log(restaurant.rows[0]);
    res.status(200).json({
      status: "Success",
      data: {
        orders: orders.rows,
        clients: clients.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// get an order
router.get("/:id", async (req, res) => {
  try {
    // sql injections protection
    // console.log(req.params.id);
    const results = await db.query(
      "select client_orders.*, clients.name from client_orders left join clients on clients.client_id = client_orders.client_id where order_id = $1;",
      [req.params.id]
    );

    // console.log(req.params.id);
    res.status(200).json({
      status: "Success",
      data: {
        order: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// create a client order
router.post("/", authorization, async (req, res) => {
  try {
    // sql injections protection
    const results = await db.query(
      "INSERT INTO client_orders (user_id, client_id, created_at, updated_at, status_id, status_name ) VALUES ($1, $2, now(), now(), $3, $4) returning *",
      [req.user.id, req.body.clientId, "1", "created"]
    );

    const order_client_name = await db.query(
      "select name from clients where client_id = $1",
      [req.body.clientId]
    );

    // console.log(results.rows[0]);
    res.status(200).json({
      status: "Success",
      data: {
        client_order: results.rows[0],
        order_client_name: order_client_name.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// update client order
router.put("/:id", async (req, res) => {
  try {
    // sql injections protection
    const results = await db.query(
      "UPDATE client_orders SET client_id = $1, status_id = $2, status_name = $3, updated_at = now() where order_id = $4 returning *",
      [
        req.body.client_id,
        req.body.status_id,
        req.body.status_name,
        req.params.id,
      ]
    );

    // console.log(results.rows[0]);
    res.status(200).json({
      status: "Success",
      data: {
        client_order: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// delete order
router.delete("/:id", async (req, res) => {
  try {
    // sql injections protection
    const results = await db.query(
      "DELETE FROM client_orders WHERE order_id = $1",
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

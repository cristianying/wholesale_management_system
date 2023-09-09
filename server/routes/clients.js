const router = require("express").Router();
const db = require("../db/index.js");
const authorization = require("../middleware/authorization.js");

// get all clients
router.get("/", authorization, async (req, res) => {
  try {
    const results = await db.query("select * from clients where user_id=$1;", [
      req.user.id,
    ]);

    res.status(200).json({
      status: "Success",
      data: {
        client: results.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// get a client
router.get("/:id", async (req, res) => {
  try {
    // sql injections protection
    // console.log(req.params.id);
    const results = await db.query(
      "select * from clients where client_id = $1;",
      [req.params.id]
    );

    // console.log(req.params.id);
    res.status(200).json({
      status: "Success",
      data: {
        client: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// create a client
router.post("/", authorization, async (req, res) => {
  try {
    // sql injections protection
    const results = await db.query(
      "INSERT INTO clients (user_id, name, email, telephone, address, country, note ) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *",
      [
        req.user.id,
        req.body.name,
        req.body.email,
        req.body.telephone,
        req.body.address,
        req.body.country,
        req.body.note,
      ]
    );

    // console.log(results.rows[0]);
    res.status(200).json({
      status: "Success",
      data: {
        client: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// update client
router.put("/:id", async (req, res) => {
  try {
    // sql injections protection
    const results = await db.query(
      "UPDATE clients SET name = $1, email = $2, telephone = $3, address = $4, country = $5, note = $6 where client_id = $7 returning *",
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
        client: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// delete client
router.delete("/:id", async (req, res) => {
  try {
    // sql injections protection
    const results = await db.query("DELETE FROM clients WHERE client_id = $1", [
      req.params.id,
    ]);

    // console.log(results.rows[0]);
    res.status(200).json({
      status: "Success",
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

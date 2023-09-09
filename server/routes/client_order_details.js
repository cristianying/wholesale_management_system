const router = require("express").Router();
const db = require("../db/index.js");
const authorization = require("../middleware/authorization.js");

// get all order products
router.get("/:id", authorization, async (req, res) => {
  try {
    // console.log(req.params.id, req.user.id);
    const order_products = await db.query(
      "select o.*, p.product_reference_id, p.product_name, p.image_json from client_order_details o left join products p on o.product_id = p.product_id where o.order_id=$1 and o.user_id =$2;",
      [req.params.id, req.user.id]
    );

    // console.log(restaurant.rows[0]);
    res.status(200).json({
      status: "Success",
      data: {
        order_products: order_products.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// add products
router.post("/:id/addProduct", authorization, async (req, res) => {
  // console.log(req.body);
  try {
    const check = await db.query(
      "UPDATE products SET current_box_quantity = current_box_quantity - $1 where user_id = $2 and product_id = $3 and current_box_quantity >= $1 returning *",
      [req.body.box_quantity, req.user.id, req.body.product_id]
    );

    if (!check.rows[0]) {
      const product = await db.query(
        "select current_box_quantity from products where user_id = $1 and product_id = $2",
        [req.user.id, req.body.product_id]
      );
      res.status(403).send({
        message: `There are only ${product.rows[0].current_box_quantity} boxes left, please refresh the page`,
      });
    } else {
      const newProduct = await db.query(
        "INSERT INTO client_order_details (user_id,order_id, product_id, box_quantity, piece_sell_price) VALUES ($1, $2 , $3, $4, $5) returning *",
        [
          req.user.id,
          req.params.id,
          req.body.product_id,
          req.body.box_quantity,
          req.body.piece_sell_price,
        ]
      );

      res.status(200).json({
        status: "Success",
        data: {
          product: newProduct.rows[0],
        },
      });
    }
  } catch (error) {
    // console.log(error);
  }
});

// update client order product
router.put("/:id", async (req, res) => {
  try {
    const check = await db.query(
      "UPDATE products SET current_box_quantity = current_box_quantity + $1 where product_id = $2 and current_box_quantity >= (-1 * $1) returning *",
      [req.body.box_quantity_delta_change, req.body.product_id]
    );

    if (!check.rows[0]) {
      const product = await db.query(
        "select current_box_quantity from products where product_id = $1",
        [req.body.product_id]
      );
      res.status(403).send({
        message: `There are only ${product.rows[0].current_box_quantity} boxes left, please refresh the page`,
      });
    } else {
      // sql injections protection
      const results = await db.query(
        "UPDATE client_order_details SET box_quantity = $1, piece_sell_price = $2 where order_detail_id = $3 returning *",
        [req.body.box_quantity, req.body.piece_sell_price, req.params.id]
      );

      // console.log(results.rows[0]);
      res.status(200).json({
        status: "Success",
        data: {
          client_order_product: results.rows[0],
          updated_current_box_quantity: check.rows[0].current_box_quantity,
        },
      });
    }
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
      "DELETE FROM client_order_details WHERE order_detail_id = $1",
      [req.params.id]
    );

    const productQuantityUpdate = await db.query(
      "UPDATE products SET current_box_quantity = current_box_quantity + $1 where product_id = $2 returning *",
      [req.body.product_order_delete_quantity, req.body.product_id]
    );

    // console.log(results.rows[0]);
    res.status(200).json({
      status: "Success",
      data: {
        updated_current_box_quantity:
          productQuantityUpdate.rows[0].current_box_quantity,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

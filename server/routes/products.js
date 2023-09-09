const router = require("express").Router();
const db = require("../db/index.js");
const authorization = require("../middleware/authorization.js");
const cloudinary = require("../utils/cloudinary");

let current_date = new Date();
// get all orders
router.get("/", authorization, async (req, res) => {
  try {
    const products = await db.query(
      "select * from products where user_id=$1 order by 1 desc;",
      [req.user.id]
    );

    // console.log("new products: ", products[0]);
    res.status(200).json({
      status: "Success",
      data: {
        products: products.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// update product
router.put("/:id", async (req, res) => {
  // 1 no image
  // 2 new image
  // 3 with image no change
  // 4 with image change
  // console.log("flag: ", req.body.isImageUpdated);
  //false
  // true
  // false
  // true
  // console.log("original: ", req.body.originalProductImg == null);
  //true
  //true
  //false
  // false

  try {
    // if the image is updated and product had an image, delete original image
    if (req.body.isImageUpdated && !(req.body.originalProductImg == null)) {
      await cloudinary.uploader.destroy(req.body.originalProductImg.public_id);
    }

    // if image updated add to cloudinary
    if (req.body.isImageUpdated) {
      var uploadedResponse = await cloudinary.uploader.upload(
        req.body.productImg,
        {
          upload_preset: "warehouse_ms",
        }
      );
    }

    const image_json = uploadedResponse
      ? uploadedResponse
      : req.body.originalProductImg;

    // sql injections protection
    const results = await db.query(
      "UPDATE products SET product_reference_id = $1, product_name = $2, type_id = $3, sub_type_id = $4, factory_id = $5, unit_cost = $6, current_box_quantity = $7, pack_per_box = $8, pieces_per_pack = $9, image_json = $10 where product_id = $11 returning *",
      [
        req.body.product_reference_id,
        req.body.product_name,
        req.body.type_id,
        req.body.sub_type_id,
        req.body.factory_id,
        req.body.unit_cost,
        req.body.current_box_quantity,
        req.body.pack_per_box,
        req.body.pieces_per_pack,
        image_json,
        req.params.id,
      ]
    );

    // console.log(results.rows[0]);
    res.status(200).json({
      status: "Success",
      data: {
        product: results.rows[0],
      },
    });
  } catch (err) {
    console.log("image upload error: ", err);
  }
});
// create a product
router.post("/", authorization, async (req, res) => {
  try {
    // sql injections protection

    if (req.body.productImg) {
      var uploadedResponse = await cloudinary.uploader.upload(
        req.body.productImg,
        {
          upload_preset: "warehouse_ms",
        }
      );
    }

    // console.log("no image", req.body.productImg);

    const results = await db.query(
      "INSERT INTO products (user_id, product_reference_id, product_name, type_id, sub_type_id, factory_id, unit_cost, current_box_quantity, pack_per_box, pieces_per_pack, created_at, updated_at, image_json ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *",
      [
        req.user.id,
        req.body.product_reference_id,
        req.body.product_name,
        req.body.type_id,
        req.body.sub_type_id,
        req.body.factory_id,
        req.body.unit_cost,
        req.body.current_box_quantity,
        req.body.pack_per_box,
        req.body.pieces_per_pack,
        current_date,
        current_date,
        uploadedResponse,
      ]
    );

    // console.log(results.rows[0]);
    res.status(200).json({
      status: "Success",
      data: {
        product: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// delete product
router.delete("/:id", async (req, res) => {
  try {
    // sql injections protection
    const results = await db.query(
      "DELETE FROM products WHERE product_id = $1 returning *",
      [req.params.id]
    );

    await cloudinary.uploader.destroy(results.rows[0].image_json.public_id);

    // console.log(results.rows[0]);
    res.status(200).json({
      status: "Success",
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

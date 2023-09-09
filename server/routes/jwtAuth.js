const router = require("express").Router();
const db = require("../db/index.js");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");

//registering
router.post("/register", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body (name, email, password)

    const { name, email, password } = req.body;

    //2. check if user exist (if user exist then throw erro)
    const user = await db.query("SELECT * FROM users WHERE user_email = $1 ", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("user already exist");
    }
    //3. Bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);
    //4. enter the new user inside our database
    const newUser = await db.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) returning *;",
      [name, email, bcryptPassword]
    );
    //res.json(newUser.rows[0]);
    //5. generating our JWT token
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json({ token });
    //min 59.33
  } catch (error) {
    console.log(error);
    res.status(500).send("server error (registering)");
  }
});

//login route
router.post("/login", validInfo, async (req, res) => {
  try {
    //1. destructure req.body

    const { email, password } = req.body;
    //2. check if user doesnt exist (if not throw error)

    const user = await db.query("SELECT * FROM users WHERE user_email=$1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect");
    }

    //3. check if incoming password is the same as the database password
    //validPassword will be a boolean true or false

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );
    //console.log(validPassword)
    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }
    // res.status(200).json({
    //     status: "you have logged in"
    //   });

    //4. give them JWT token
    const token = jwtGenerator(user.rows[0].user_id);
    // console.log(token)
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error (login)");
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error);
    res.status(500).send("server error (login)");
  }
});

module.exports = router;

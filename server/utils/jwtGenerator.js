const jwt = require ("jsonwebtoken");
require ('dotenv').config();


function jwtGenerator(user_id){

    const payload= {
        user:{
            id: user_id
        }
    }
    // setting 1hr for the token to expire
    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"})
}

module.exports = jwtGenerator;
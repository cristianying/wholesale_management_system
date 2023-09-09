const { Pool } = require("pg");

const pool = new Pool();
// no need to manually write them, pg library will check .env
//   {
//     user: 'postgres',
//     host: 'localhost',
//     database: 'yelp',
//     password: 'c159357',
//     port: 5432,
// }

module.exports = {
  query: (text, params) => pool.query(text, params),
};

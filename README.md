# wholesale_management_system

To set up in your local machine

1. git clone https://github.com/cristianying/wholesale_management_system.git
2. npm install in both server and client
3. set up .env if not already there, with below text (xxxxx = set up according to ur own settings)

- PORT = xxxxx
- PGUSER= xxxxx
- PGHOST= xxxxx
- PGPASSWORD= xxxxxx
- PGDATABASE= xxxxx
- PGPORT= xxxx

- jwtSecret = xxxxxx

4. downloand postresql and install psql in terminal
5. install uuid-ossp for auto creation of primary keys
6. add all tables from DB file
7. npm start in both server and client
8. good to go

To run in prod:

- Node Js backend in https://railway.app/dashboard
- in the package.json remove "start": "nodemon server.js" and replace with "start": "node server.js"

- The frontend react in https://vercel.com/cristianying/
- in the src/apis/Warehousedb.js replace local host url with baseURL: "wholesalemanagementsystem-production.up.railway.app",

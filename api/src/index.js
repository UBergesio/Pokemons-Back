const express = require("express");
//const server = require("./app");
const { conn } = require("./DB_connection");
const routerAllPoke = require("./controllers/getAllPoke");
const routerById = require("./controllers/getPokeById");
const routerByName = require("./controllers/getPokeName");
const router = require("./routes/index")

const server = express();

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use(express.json());

//ENRUTADO
server.use("/pokemons", router);

const PORT = process.env.PORT || 3001;

conn
  .sync({ force: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server raised in port: " + PORT);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

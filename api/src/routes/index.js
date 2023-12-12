const { Router } = require("express");

const getAllPoke = require("../controllers/getAllPoke");
const getPokeById = require("../controllers/getPokeById");
const getPokeName = require("../controllers/getPokeName");
const postPoke = require("../controllers/postPoke");
const getTypes = require("../controllers/getTypes");


const router = Router();

router.get("/name", getPokeName);
router.get("/types", getTypes);
router.get("/:idPokemon", getPokeById);
router.get("/", getAllPoke);
router.post("/", postPoke);


module.exports = router;

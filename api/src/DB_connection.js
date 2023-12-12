require("dotenv").config();
const { Sequelize } = require("sequelize");
const { DB_USER, DB_PASSWORD, DB_HOST, DATABASE_URL } = process.env;
const PokemonModel = require("../src/models/pokemon");
const PokemonTypeModel = require("../src/models/type_pokemon");

/* const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`,
  { logging: false, native: false }
); */
const sequelize = new Sequelize(
  DATABASE_URL,
  { logging: false, native: false }
);



PokemonModel(sequelize);

PokemonTypeModel(sequelize);


const { Pokemon, Pokemon_type } = sequelize.models;

Pokemon.belongsToMany(Pokemon_type, { through: "pokemon_type" });
Pokemon_type.belongsToMany(Pokemon, { through: "pokemon_type" });


module.exports = {
  Pokemon,
  Pokemon_type,
  conn: sequelize,
};

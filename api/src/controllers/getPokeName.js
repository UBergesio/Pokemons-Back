const axios = require("axios");
const { Pokemon, Pokemon_type } = require("../DB_connection");

const URL = "https://pokeapi.co/api/v2/pokemon/";

const getPokeName = async (req, res) => {
  const { name } = req.query;
  const nameMinuscula = name.toLowerCase();

  try {
    const response = await axios.get(`${URL}${nameMinuscula}`);
    const { data } = response;
    const typesName = data.types.map((type) => type.type.name).join(", ");

    const types = data.types.map((type) => {
      const partsType = type.type.url.split("/");
      return Number(partsType[partsType.length - 2]);
    });

    const objPoke = {
      id: data.id,
      nombre: data.name,
      imagen: data.sprites.other.dream_world.front_default,
      vida: data.stats[0].base_stat,
      ataque: data.stats[1].base_stat,
      defensa: data.stats[2].base_stat,
      velocidad: data.stats[5].base_stat,
      altura: data.height,
      peso: data.weight,
      tiposName: typesName,
      tipos: types,
    };

    const objPoke2 = await Pokemon.create({
      id: data.id,
      nombre: data.name,
      imagen: data.sprites.other.dream_world.front_default,
      vida: data.stats[0].base_stat,
      ataque: data.stats[1].base_stat,
      defensa: data.stats[2].base_stat,
      velocidad: data.stats[5].base_stat,
      altura: data.height,
      peso: data.weight,
    });
    await objPoke2.addPokemon_types(types);

    res.status(200).json(objPoke);
  } catch (error) {
    try {
      const searchNameDB = await Pokemon.findOne({
        where: { nombre: nameMinuscula },
        include: {
          model: Pokemon_type,
          attributes: ["nombre"],
          through: {
            attributes: [],
          },
        },
      });

      if (searchNameDB) {
        res.status(200).json(searchNameDB);
      } else {
        res.status(404).send("No existen Pokemons con ese nombre.");
      }
    } catch (dbError) {
      res.status(500).json({ error: dbError.message });
    }
  }
};

module.exports = getPokeName;

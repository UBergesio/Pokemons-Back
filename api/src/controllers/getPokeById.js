const axios = require("axios");
const { Pokemon, Pokemon_type } = require("../DB_connection");

const URL = "https://pokeapi.co/api/v2/pokemon/";
const getPokeById = async (req, res) => {
  const { idPokemon } = req.params;
  try {
    //!PARA BUSCAR EN LA API
    const response = await axios.get(`${URL}${idPokemon}`);
    const { data } = response;

    const types = data.types.map((type) => type.type.name).join(", ");

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
      Tipos: types,
    };
    //Aca deberia ir el catch en caso de que la busqueda en la api lanze un error.
    //! PARA BUSCAR EN LA DB
    const searchPokeDB = await Pokemon.findOne({
      where: { id: idPokemon },
      include: {
        model: Pokemon_type,
        attributes: ["nombre"],
        through: {
          attributes: [],
        },
      },
    });

    if (objPoke) {
      res.status(200).json(objPoke);
    } else if(searchPokeDB) {
      res.status(200).json(searchPokeDB);
    } else {res.status(404).send("No existen Pokemons con ese ID.")}
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getPokeById;

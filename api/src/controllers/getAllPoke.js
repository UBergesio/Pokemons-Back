const axios = require("axios");
const { Pokemon, conn } = require("../DB_connection")

const URL = "https://pokeapi.co/api/v2/pokemon/";

const getAllPoke = async (req, res) => {
  try {
    const response = await axios.get(`${URL}`);
    const { data } = response;

    // ! PARA MOSTRAR LOS POKEMONS EN PANTALLA
    //Saco el id de cada pokemon a travez de la url que devuelve la api.
    const pokemonNumbers = data.results.map((pokemon) => {
      const parts = pokemon.url.split("/");
      return parts[parts.length - 2];
    });

    const allPokemons = [];
    const errors = [];

    await Promise.all(
      pokemonNumbers.map(async (id) => {
        try {
          const pokeById = await axios.get(`${URL}${id}`);
          const { data } = pokeById;

          const types = data.types.map((type) => {
            const partsType = type.type.url.split("/");
            return partsType[partsType.length - 2];
          });

          // ! Guardar el Pokémon en la base de datos
          const objPoke = await Pokemon.create({
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
          await objPoke.addPokemon_types(types);

          const searchTypeDB = await conn.models.pokemon_type.findAll({
            where: { PokemonId: data.id },
            attributes: ["PokemonTypeId"],
          });
          const pokemonTypeIds = searchTypeDB.map((row) => row.PokemonTypeId);

          const objPokeWithType = {
            id: data.id,
            nombre: data.name,
            imagen: data.sprites.other.dream_world.front_default,
            vida: data.stats[0].base_stat,
            ataque: data.stats[1].base_stat,
            defensa: data.stats[2].base_stat,
            velocidad: data.stats[5].base_stat,
            altura: data.height,
            peso: data.weight,
            tipos: pokemonTypeIds,
          };

          // Agregar el Pokémon al array de resultados
          allPokemons.push(objPokeWithType);
        } catch (error) {
          errors.push(error.message);
        }
      })
    );

    if (errors.length > 0) {
      return res.status(500).json({ errors });
    } else if (allPokemons.length > 0) {
      return res.status(200).json(allPokemons);
    } else {
      return res.status(404).send("Not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};

module.exports = getAllPoke;

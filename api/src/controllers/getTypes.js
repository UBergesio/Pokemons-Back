const axios = require("axios");
const { Pokemon_type } = require("../DB_connection");

const getTypes = async (req, res) => {
  const URL = "https://pokeapi.co/api/v2/type";

  try {
    const response = await axios.get(`${URL}`);
    const { data } = response;
    const types = data.results;

    if (!types || types.length === 0) {
      res.status(400).send("No hay tipos disponibles");
    } else {
      // Promise.all para esperar a que todas las inserciones en la base de datos se completen antes de responder con el estado y los datos.
      const allTypes = await Promise.all(
        types.map(async (cadaTipo) => {
          const nombType = cadaTipo.name;
          const parts = cadaTipo.url.split("/");
          const idType = parts[parts.length - 2]; // Obtener el número de identificación desde la URL

          const createdType = await Pokemon_type.create({
            nombre: nombType,
            id: idType,
          });

          return createdType;
        })
      );

      res.status(201).json(allTypes);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = getTypes;

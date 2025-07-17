const connection = require("../../db").default;
const { formatToday } = require("../helpers/dateHelper");
const { formatRango } = require("./rangoModel");

exports.getPlayersByTeams = async (teamId) => {
  console.log("teamIds en jugModel---> " + JSON.stringify(teamId));

  const query = `
      SELECT DISTINCT id_jugador
      FROM equipo_jugador
      WHERE activo = 1
      AND id_equipo = ?
      ORDER BY fecha_alta DESC
      LIMIT 5
      `;

  try {
    [results] = await connection.query(query, teamId);
    if (!results || results.length === 0) {
      return [];
    }
    console.log("Query Results:", results);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al recuperar los jugadores de los equipos.");
  }
};

exports.getUserDataByPlayer = async (playerId) => {
  console.log("jugadorModel -> playerIds = " + JSON.stringify(playerId));

  const query = `
      SELECT id_usuario, username, tag, img, id_rango, id_rol, id_agente
      FROM usuario_perfil
      WHERE id_usuario = ?
      `;

  try {
    [results] = await connection.query(query, [playerId]);
    console.log("User Details:", results);
  } catch (error) {
    console.log(error);
    throw new Error("Error al recuperar los detalles del usuario.");
  }

  results.map((user) => {
    user.id_usuario = user.id_usuario;
    user.player = user.username + "#" + user.tag;
    user.img = user.img ? user.img : null;
  });

  return results;
};

exports.all = async () => {
  const query = `
      SELECT id_usuario, username, tag, img, id_rango, id_rol, id_agente
      FROM usuario_perfil
      `;
  try {
    [results] = await connection.query(query);
    return results;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al recuperar los jugadores del modelo",
    });
  }
};

exports.find = async (ID) => {
  const query = `
      SELECT id_usuario, username, tag, img, id_rango, id_rol, id_agente
      FROM usuario_perfil
      WHERE id_usuario = ?
      `;

  try {
    [results] = await connection.query(query, [ID]);
    return results.length == 1 ? results[0] : null;
  } catch (error) {
    throw error;
  }
};

exports.update = async (ID, updates) => {
  if (
    !updates ||
    typeof updates !== "object" ||
    Object.keys(updates).length === 0
  ) {
    throw new Error("No hay cambios para impactar");
  }

  const columnsModif = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");

  console.log(columnsModif);

  const query = `
      UPDATE usuario_perfil
      SET ${columnsModif},
      ult_modificacion = ?
      WHERE id_usuario = ?
      `;

  const values = [...Object.values(updates), formatToday(), ID];

  try {
    await connection.query(query, values);
  } catch (error) {
    throw error;
  }
};

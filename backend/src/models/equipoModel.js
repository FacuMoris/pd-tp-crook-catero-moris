const connection = require("../../db");
const { formatToday } = require("../helpers/dateHelper");
const jugadorModel = require("./jugadorModel");

exports.all = async () => {
  const query = `
    SELECT id, nombre, id_lider, num_jugadores
    FROM equipo
    `;
  try {
    [results] = await connection.query(query);
    return results;
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al recuperar los equipos" });
  }
};

exports.create = async ({ nombre, lider }) => {
  const query = `
    INSERT INTO equipo(nombre, id_usuario_lider, jugadores, estado, fecha_alta, fecha_estado)
    VALUES(?, ?, ?, ?, ?, ?)
    `;

  try {
    await connection.query(query, [
      nombre,
      lider,
      1,
      "BUSCANDO",
      formatToday(),
      formatToday(),
    ]);
  } catch (error) {
    throw error;
  }
};

exports.find = async (ID) => {
  const query = `
    SELECT id, nombre, id_lider, num_jugadores, id_estado
    FROM equipo
    WHERE id = ?
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
    typeof updates != "object" ||
    Object.keys(updates).length === 0
  ) {
    throw new Error("No hay cambios para impactar");
  }

  const columnsModif = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");

  console.log(columnsModif);

  const query = `
    UPDATE equipo
    SET ${columnsModif},
    fecha_estado = ?
    WHERE id = ?
    `;

  const values = [...Object.values(updates), formatToday(), ID];

  try {
    await connection.query(query, values);
  } catch (error) {
    throw error;
  }
};

exports.getActiveTeams = async () => {
  const query = `
    SELECT id, nombre, id_lider, num_jugadores
    FROM equipo
    WHERE id_estado = ?
    `;
  try {
    const [teams] = await connection.query(query, [1]);

    if (teams.length === 0) {
      throw new Error("No hay equipos activos.");
    }
    console.log("teams ---> " + JSON.stringify(teams, null, 2));
    const teamsWithPlayers = await Promise.all(
      teams.map(async (team) => {
        console.log("PROCESANDO TEAM " + JSON.stringify(team, null, 2));
        const players = await jugadorModel.getPlayersByTeams(team.id);

        // Obtener la información de cada jugador
        const playersInfo = await Promise.all(
          players.map(async (player) => {
            console.log("PROCESANDO PLAYER " + JSON.stringify(player));
            const userData = await jugadorModel.getUserDataByPlayer(
              player.id_jugador
            );
            return userData[0]; // Asumiendo que `getUserDataByPlayer` devuelve un array con un solo objeto
          })
        );

        return { ...team, playersInfo };
      })
    );
    return teamsWithPlayers;
  } catch (error) {
    console.log(error);
    throw new Error("Error a recuperar los equipos activos");
  }
};

exports.getHistory = async (ID) => {
  const query = `
      SELECT id, nombre, id_lider, id_estado, fecha_estado
      FROM equipo
      WHERE id IN ( SELECT DISTINCT id FROM equipo_jugador WHERE id_jugador = ? )
      `;
  try {
    [results] = await connection.query(query, [ID]);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error a recuperar el historial");
  }
};

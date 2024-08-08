const equipoModel = require("../models/equipoModel");
const jugadorModel = require("../models/jugadorModel");
const rangoModel = require("../models/rangoModel");

exports.index = async (req, res) => {
  try {
    const results = await equipoModel.all();
    res.json({ success: true, results });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al recuperar los equipos" });
  }
};

exports.store = async (req, res) => {
  const { nombre, lider } = req.body;

  try {
    await equipoModel.create({ nombre, lider });
    res.json({
      success: true,
      message: "El equipo se ha creado correctamente",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al crear el equipo" });
  }
};

exports.show = async (req, res) => {
  const { ID } = req.params;

  try {
    const result = await equipoModel.find(ID);
    if (result == null) {
      res.status(404).json({
        success: false,
        message: "El equipo no existe o ha dejado de existir",
      });
    } else {
      res.json({ success: true, result });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al recuperar el equipo" });
  }
};

exports.update = async (req, res) => {
  const { ID } = req.params;
  const updates = req.body;

  try {
    await equipoModel.update(ID, updates);
    res.json({ success: true, message: "El equipo se modificó correctamente" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al modificar el equipo" });
  }
};

exports.activeTeams = async (req, res) => {
  try {
    const activeTeams = await equipoModel.getActiveTeams();
    //const teamIds = activeTeams.map((team) => team.id);

    //const players = await jugadorModel.getPlayersByTeams(teamIds);
    //const playerIds = players.map((player) => player.id_jugador);

    //const playersInfo = await jugadorModel.getUserDataByPlayer(playerIds);

    const results = activeTeams.map((team) => {
      return {
        ...team,
        //  jugadores: playersInfo,
      };
    });

    res.json({ success: true, results });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al recuperar los equipos activos",
    });
  }
};

exports.history = async (req, res) => {
  const { ID } = req.params;
  try {
    const results = await equipoModel.getHistory(ID);
    res.json({ success: true, results });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al recuperar el historial" });
  }
};

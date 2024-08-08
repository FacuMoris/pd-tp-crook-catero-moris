const jugadorModel = require("../models/jugadorModel");
const rangoModel = require("../models/rangoModel");

exports.index = async (req, res) => {
  try {
    const results = await jugadorModel.all();
    res.json({ success: true, results });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al recuperar los jugadores" });
  }
};

exports.show = async (req, res) => {
  const { ID } = req.params;

  try {
    const result = await jugadorModel.find(ID);
    if (result == null) {
      res.status(404).json({
        success: false,
        message: "El jugador no existe o ha dejado de existir",
      });
    } else {
      res.json({ success: true, result });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al recuperar el jugador" });
  }
};

exports.update = async (req, res) => {
  const { ID } = req.params;
  const updates = req.body;

  try {
    await jugadorModel.update(ID, updates);
    res.json({
      success: true,
      message: "El jugador se modificó correctamente",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al modificar el jugador" });
  }
};

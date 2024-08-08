const rangoModel = require("../models/rangoModel");

exports.index = async (req, res) => {
  try {
    const results = await rangoModel.all();
    res.json({ success: true, results });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al recuperar los rangos" });
  }
};

exports.show = async (req, res) => {
  const { ID } = req.params;

  try {
    const result = await rangoModel.find(ID);
    if (result == null) {
      res.status(404).json({
        success: false,
        message: "El rango no existe o ha dejado de existir",
      });
    } else {
      res.json({ success: true, result });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al recuperar el rango" });
  }
};

exports.store = async (req, res) => {
  const { rango, nro_div } = req.body;
  try {
    await rangoModel.create({ rango, nro_div });
    res.json({
      success: true,
      message: "El rango se ha creado correctamente",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al crear el rango" });
  }
};

exports.update = async (req, res) => {
  const { ID } = req.params;
  const { rango, nro_div } = req.body;

  try {
    await rangoModel.update(ID, rango, nro_div);
    res.json({
      success: true,
      message: "El rango se modificó correctamente",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al modificar el rango" });
  }
};

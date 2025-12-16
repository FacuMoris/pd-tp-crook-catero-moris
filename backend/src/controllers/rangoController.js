import * as rangoModel from "../models/rangoModel.js";

export const list = async (req, res) => {
  try {
    const rows = await rangoModel.getAll();
    const results = rows.map((r) => ({ id: r.id, nombre: r.nombre }));
    res.json({ success: true, results });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al intentar obtener rangos",
    });
  }
};

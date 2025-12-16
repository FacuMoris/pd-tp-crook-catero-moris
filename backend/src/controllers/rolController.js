import * as rolModel from "../models/rolModel.js";

export const list = async (req, res) => {
  try {
    const rows = await rolModel.getAll();
    const results = rows.map((r) => ({ id: r.id, nombre: r.nombre }));
    res.json({ success: true, results });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al intentar obtener roles",
    });
  }
};

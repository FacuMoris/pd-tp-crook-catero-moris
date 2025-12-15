import * as equipoModel from "../models/equipoModel.js";

export const list = async (req, res) => {
  try {
    const equipos = await equipoModel.getAll();
    return res.json({ success: true, result: equipos });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al listar equipos" });
  }
};

export const get = async (req, res) => {
  try {
    const equipo = await equipoModel.getById(Number(req.params.id));
    if (!equipo) {
      return res
        .status(404)
        .json({ success: false, message: "Equipo no encontrado" });
    }
    return res.json({ success: true, result: equipo });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener equipo" });
  }
};

export const updateEstado = async (req, res) => {
  const { id_estado } = req.body;
  if (!id_estado) {
    return res.status(400).json({ success: false, message: "Falta id_estado" });
  }

  try {
    const affected = await equipoModel.updateEstado(
      Number(req.params.id),
      Number(id_estado)
    );

    if (!affected) {
      return res
        .status(404)
        .json({ success: false, message: "Equipo no encontrado" });
    }

    return res.json({
      success: true,
      message: "Estado del equipo actualizado",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al actualizar estado" });
  }
};

export const remove = async (req, res) => {
  try {
    const affected = await equipoModel.remove(Number(req.params.id));
    if (!affected) {
      return res
        .status(404)
        .json({ success: false, message: "Equipo no encontrado" });
    }
    return res.json({
      success: true,
      message: "Equipo eliminado correctamente",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al eliminar equipo" });
  }
};

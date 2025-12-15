import * as estadoEquipoModel from "../models/estadoEquipoModel.js";

export const list = async (req, res) => {
  try {
    const estados = await estadoEquipoModel.getAll();
    return res.json({ success: true, result: estados });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al listar estados de equipo" });
  }
};

export const get = async (req, res) => {
  try {
    const estado = await estadoEquipoModel.getById(req.params.id);
    if (!estado)
      return res
        .status(404)
        .json({ success: false, message: "Estado no encontrado" });
    return res.json({ success: true, result: estado });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener estado" });
  }
};

export const create = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre)
    return res.status(400).json({ success: false, message: "Falta nombre" });

  try {
    await estadoEquipoModel.create({ nombre });
    return res.json({ success: true, message: "Estado creado correctamente" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al crear estado" });
  }
};

export const update = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre)
    return res.status(400).json({ success: false, message: "Falta nombre" });

  try {
    const affected = await estadoEquipoModel.update(req.params.id, { nombre });
    if (!affected)
      return res
        .status(404)
        .json({ success: false, message: "Estado no encontrado" });
    return res.json({
      success: true,
      message: "Estado actualizado correctamente",
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
    const affected = await estadoEquipoModel.remove(req.params.id);
    if (!affected)
      return res
        .status(404)
        .json({ success: false, message: "Estado no encontrado" });
    return res.json({
      success: true,
      message: "Estado eliminado correctamente",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al eliminar estado" });
  }
};

import * as rangoModel from "../models/rangoModel.js";

export const list = async (req, res) => {
  try {
    const rangos = await rangoModel.getAll();
    return res.json({ success: true, result: rangos });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al listar rangos" });
  }
};

export const get = async (req, res) => {
  try {
    const rango = await rangoModel.getById(req.params.id);
    if (!rango)
      return res
        .status(404)
        .json({ success: false, message: "Rango no encontrado" });
    return res.json({ success: true, result: rango });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener rango" });
  }
};

export const create = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre)
    return res.status(400).json({ success: false, message: "Falta nombre" });

  try {
    await rangoModel.create({ nombre, descripcion });
    return res.json({ success: true, message: "Rango creado correctamente" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al crear rango" });
  }
};

export const update = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre)
    return res.status(400).json({ success: false, message: "Falta nombre" });

  try {
    const affected = await rangoModel.update(req.params.id, {
      nombre,
      descripcion,
    });
    if (!affected)
      return res
        .status(404)
        .json({ success: false, message: "Rango no encontrado" });
    return res.json({
      success: true,
      message: "Rango actualizado correctamente",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al actualizar rango" });
  }
};

export const remove = async (req, res) => {
  try {
    const affected = await rangoModel.remove(req.params.id);
    if (!affected)
      return res
        .status(404)
        .json({ success: false, message: "Rango no encontrado" });
    return res.json({
      success: true,
      message: "Rango eliminado correctamente",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al eliminar rango" });
  }
};

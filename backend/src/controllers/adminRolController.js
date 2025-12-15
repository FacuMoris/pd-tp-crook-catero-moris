import * as rolModel from "../models/rolModel.js";

export const list = async (req, res) => {
  try {
    const roles = await rolModel.getAll();
    return res.json({ success: true, result: roles });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al listar roles" });
  }
};

export const get = async (req, res) => {
  try {
    const rol = await rolModel.getById(req.params.id);
    if (!rol)
      return res
        .status(404)
        .json({ success: false, message: "Rol no encontrado" });
    return res.json({ success: true, result: rol });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener rol" });
  }
};

export const create = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre)
    return res.status(400).json({ success: false, message: "Falta nombre" });

  try {
    await rolModel.create({ nombre, descripcion });
    return res.json({ success: true, message: "Rol creado correctamente" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al crear rol" });
  }
};

export const update = async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre)
    return res.status(400).json({ success: false, message: "Falta nombre" });

  try {
    const affected = await rolModel.update(req.params.id, {
      nombre,
      descripcion,
    });
    if (!affected)
      return res
        .status(404)
        .json({ success: false, message: "Rol no encontrado" });
    return res.json({
      success: true,
      message: "Rol actualizado correctamente",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al actualizar rol" });
  }
};

export const remove = async (req, res) => {
  try {
    const affected = await rolModel.remove(req.params.id);
    if (!affected)
      return res
        .status(404)
        .json({ success: false, message: "Rol no encontrado" });
    return res.json({ success: true, message: "Rol eliminado correctamente" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al eliminar rol" });
  }
};

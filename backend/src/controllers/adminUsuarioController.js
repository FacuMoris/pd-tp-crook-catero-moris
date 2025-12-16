import * as usuarioModel from "../models/usuarioModel.js";

export const list = async (req, res) => {
  try {
    const usuarios = await usuarioModel.getAll();
    return res.json({ success: true, result: usuarios });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al listar usuarios" });
  }
};

export const get = async (req, res) => {
  try {
    const usuario = await usuarioModel.getById(Number(req.params.id));
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    return res.json({ success: true, result: usuario });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener usuario" });
  }
};

export const create = async (req, res) => {
  const { nombre, apellido, email, telefono, pass, is_admin } = req.body;

  if (!nombre || !apellido || !email || !pass) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos obligatorios (nombre, apellido, email, pass)",
    });
  }

  try {
    const id = await usuarioModel.createByAdmin({
      nombre,
      apellido,
      email,
      telefono: telefono ?? "",
      pass,
      is_admin: is_admin ? 1 : 0,
    });

    return res.json({
      success: true,
      message: "Usuario creado correctamente",
      id,
    });
  } catch (e) {
    console.log("CREATE ADMIN USUARIO ERROR =>", {
      code: e?.code,
      errno: e?.errno,
      sqlMessage: e?.sqlMessage,
      message: e?.message,
    });

    if (e?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Ya existe un usuario con ese email",
      });
    }

    return res
      .status(500)
      .json({ success: false, message: "Error al crear usuario" });
  }
};

export const update = async (req, res) => {
  const { nombre, apellido, email, telefono, is_admin } = req.body;

  if (
    nombre === undefined ||
    apellido === undefined ||
    email === undefined ||
    telefono === undefined ||
    is_admin === undefined
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan datos obligatorios" });
  }

  try {
    const affected = await usuarioModel.updateById(Number(req.params.id), {
      nombre,
      apellido,
      email,
      telefono,
      is_admin,
    });

    if (!affected) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    return res.json({
      success: true,
      message: "Usuario actualizado correctamente",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al actualizar usuario" });
  }
};

export const remove = async (req, res) => {
  try {
    const affected = await usuarioModel.removeById(Number(req.params.id));
    if (!affected) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    return res.json({
      success: true,
      message: "Usuario eliminado correctamente",
    });
  } catch (e) {
    console.log("DELETE USUARIO ERROR =>", {
      code: e?.code,
      errno: e?.errno,
      sqlMessage: e?.sqlMessage,
    });

    return res.status(409).json({
      success: false,
      message:
        "No se puede eliminar el usuario porque tiene información asociada",
    });
  }
};

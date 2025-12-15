import * as jugadorModel from "../models/jugadorModel.js";

export const getMe = async (req, res) => {
  try {
    const jugador = await jugadorModel.getByUsuarioId(req.user.ID);
    return res.json({ success: true, result: jugador });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error al intentar recuperar el jugador",
    });
  }
};

export const createMe = async (req, res) => {
  const { nickname, id_rango, id_rol, edad, bio } = req.body;

  if (!nickname || !id_rango || !id_rol) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan datos obligatorios" });
  }

  try {
    const existente = await jugadorModel.getByUsuarioId(req.user.ID);
    if (existente) {
      return res.status(409).json({
        success: false,
        message: "El usuario ya tiene perfil jugador",
      });
    }

    await jugadorModel.createForUsuario({
      id_usuario: req.user.ID,
      nickname,
      id_rango,
      id_rol,
      edad,
      bio,
    });

    return res.json({ success: true, message: "Jugador creado correctamente" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al intentar crear el jugador" });
  }
};

export const updateMe = async (req, res) => {
  const { nickname, id_rango, id_rol, edad, bio } = req.body;

  if (!nickname || !id_rango || !id_rol) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan datos obligatorios" });
  }

  try {
    const affected = await jugadorModel.updateForUsuario({
      id_usuario: req.user.ID,
      nickname,
      id_rango,
      id_rol,
      edad,
      bio,
    });

    if (!affected) {
      return res
        .status(404)
        .json({ success: false, message: "Jugador no encontrado" });
    }

    return res.json({
      success: true,
      message: "Jugador actualizado correctamente",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error al intentar actualizar el jugador",
    });
  }
};

export const deleteMe = async (req, res) => {
  try {
    const affected = await jugadorModel.deleteForUsuario(req.user.ID);
    if (!affected) {
      return res
        .status(404)
        .json({ success: false, message: "Jugador no encontrado" });
    }
    return res.json({
      success: true,
      message: "Jugador eliminado correctamente",
    });
  } catch (e) {
    console.log("CREATE JUGADOR ERROR =>", {
      code: e?.code,
      errno: e?.errno,
      sqlMessage: e?.sqlMessage,
      message: e?.message,
    });

    return res.status(500).json({
      success: false,
      message: "Error al intentar crear el jugador",
      detail: {
        code: e?.code,
        sqlMessage: e?.sqlMessage,
        message: e?.message,
      },
    });
  }
};

import * as jugadorModel from "../models/jugadorModel.js";

export const list = async (req, res) => {
  try {
    const jugadores = await jugadorModel.getAll();
    return res.json({ success: true, result: jugadores });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al listar jugadores" });
  }
};

export const get = async (req, res) => {
  try {
    const jugador = await jugadorModel.getByIdAdmin(Number(req.params.id));
    if (!jugador) {
      return res
        .status(404)
        .json({ success: false, message: "Jugador no encontrado" });
    }
    return res.json({ success: true, result: jugador });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener jugador" });
  }
};

export const update = async (req, res) => {
  const { nickname, id_rango, id_rol, edad, bio } = req.body;

  if (!nickname || !id_rango || !id_rol) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan datos obligatorios" });
  }

  try {
    const affected = await jugadorModel.updateById(Number(req.params.id), {
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
    return res
      .status(500)
      .json({ success: false, message: "Error al actualizar jugador" });
  }
};

export const remove = async (req, res) => {
  try {
    const affected = await jugadorModel.removeById(Number(req.params.id));
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
    console.log(e);
    return res.status(409).json({
      success: false,
      message:
        "No se puede eliminar el jugador porque tiene equipos o membresías asociadas",
    });
  }
};

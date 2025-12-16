import * as jugadorModel from "../models/jugadorModel.js";
import * as equipoModel from "../models/equipoModel.js";
import * as equipoJugadorModel from "../models/equipoJugadorModel.js";

const getMiJugadorId = async (req) => {
  const jugador = await jugadorModel.getByUsuarioId(req.user.ID);
  return jugador ? jugador.id : null;
};

const assertEsLider = async (req, res, id_equipo) => {
  const equipo = await equipoModel.getById(id_equipo);
  if (!equipo) {
    res.status(404).json({ success: false, message: "Equipo no encontrado" });
    return null;
  }

  const miJugadorId = await getMiJugadorId(req);
  if (!miJugadorId) {
    res
      .status(409)
      .json({ success: false, message: "El usuario no tiene perfil jugador" });
    return null;
  }

  if (equipo.id_lider !== miJugadorId) {
    res.status(403).json({
      success: false,
      message: "Acceso denegado (no sos líder del equipo)",
    });
    return null;
  }

  return { equipo, miJugadorId };
};

// MIS EQUIPOS

export const listMine = async (req, res) => {
  try {
    const miJugadorId = await getMiJugadorId(req);
    if (!miJugadorId) {
      return res.status(409).json({
        success: false,
        message: "El usuario no tiene perfil jugador",
      });
    }

    const equipos = await equipoModel.getAllByLider(miJugadorId);
    return res.json({ success: true, result: equipos });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al listar equipos" });
  }
};

export const createMine = async (req, res) => {
  const { nombre, id_estado } = req.body;
  if (!nombre || !id_estado) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan datos obligatorios" });
  }

  try {
    const miJugadorId = await getMiJugadorId(req);
    if (!miJugadorId) {
      return res.status(409).json({
        success: false,
        message: "El usuario no tiene perfil jugador",
      });
    }

    const id = await equipoModel.create({
      nombre,
      id_lider: miJugadorId,
      id_estado,
    });
    return res.json({
      success: true,
      message: "Equipo creado correctamente",
      id,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al crear equipo" });
  }
};

export const updateMine = async (req, res) => {
  const { nombre, id_estado } = req.body;
  if (!nombre || !id_estado) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan datos obligatorios" });
  }

  try {
    const ok = await assertEsLider(req, res, Number(req.params.id));
    if (!ok) return;

    const affected = await equipoModel.update(Number(req.params.id), {
      nombre,
      id_estado,
    });
    if (!affected)
      return res
        .status(404)
        .json({ success: false, message: "Equipo no encontrado" });

    return res.json({
      success: true,
      message: "Equipo actualizado correctamente",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al actualizar equipo" });
  }
};

export const deleteMine = async (req, res) => {
  try {
    const ok = await assertEsLider(req, res, Number(req.params.id));
    if (!ok) return;

    const affected = await equipoModel.remove(Number(req.params.id));
    if (!affected)
      return res
        .status(404)
        .json({ success: false, message: "Equipo no encontrado" });

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

// MIEMBROS
export const listMiembros = async (req, res) => {
  try {
    const ok = await assertEsLider(req, res, Number(req.params.id));
    if (!ok) return;

    const miembros = await equipoJugadorModel.listActivosByEquipo(
      Number(req.params.id)
    );
    return res.json({ success: true, result: miembros });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al listar miembros" });
  }
};

export const addMiembro = async (req, res) => {
  const { id_jugador } = req.body;
  if (!id_jugador) {
    return res
      .status(400)
      .json({ success: false, message: "Falta id_jugador" });
  }

  try {
    const ok = await assertEsLider(req, res, Number(req.params.id));
    if (!ok) return;

    const ya = await equipoJugadorModel.existsActivo({
      id_equipo: Number(req.params.id),
      id_jugador: Number(id_jugador),
    });

    if (ya) {
      return res.status(409).json({
        success: false,
        message: "El jugador ya es miembro del equipo",
      });
    }

    const id = await equipoJugadorModel.add({
      id_equipo: Number(req.params.id),
      id_jugador: Number(id_jugador),
    });

    return res.json({
      success: true,
      message: "Miembro agregado correctamente",
      id,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al agregar miembro" });
  }
};

export const removeMiembro = async (req, res) => {
  try {
    const ok = await assertEsLider(req, res, Number(req.params.id));
    if (!ok) return;

    const affected = await equipoJugadorModel.baja({
      id_equipo: Number(req.params.id),
      id_jugador: Number(req.params.id_jugador),
    });

    if (!affected) {
      return res.status(404).json({
        success: false,
        message: "Miembro no encontrado o ya dado de baja",
      });
    }

    return res.json({
      success: true,
      message: "Miembro dado de baja correctamente",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "Error al dar de baja miembro" });
  }
};

export const getById = async (req, res) => {
  try {
    const equipo = await equipoModel.getByIdAndUsuario(
      Number(req.params.id),
      req.user.ID
    );

    if (!equipo) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado o no autorizado",
      });
    }

    return res.json({
      success: true,
      result: equipo,
    });
  } catch (error) {
    console.log("CREATE EQUIPO ERROR =>", {
      code: error?.code,
      errno: error?.errno,
      sqlMessage: error?.sqlMessage,
      message: error?.message,
    });

    return res.status(500).json({
      success: false,
      message: "Error al crear equipo",
      detail: {
        code: error?.code,
        sqlMessage: error?.sqlMessage,
      },
    });
  }
};

export const listAll = async (req, res) => {
  try {
    const equipos = await equipoModel.getAll();
    return res.json({
      success: true,
      result: equipos,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error al listar equipos",
    });
  }
};

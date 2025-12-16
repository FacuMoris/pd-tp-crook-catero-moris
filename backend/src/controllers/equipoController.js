import * as jugadorModel from "../models/jugadorModel.js";
import * as equipoModel from "../models/equipoModel.js";
import * as equipoJugadorModel from "../models/equipoJugadorModel.js";
import * as equipoMensajeModel from "../models/equipoMensajeModel.js";

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

    const pk = await equipoJugadorModel.add({
      id_equipo: Number(req.params.id),
      id_jugador: Number(id_jugador),
    });

    return res.json({
      success: true,
      message: "Miembro agregado correctamente",
      result: pk, // { id_equipo, id_jugador }
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
    const [equipos, miembrosActivos] = await Promise.all([
      equipoModel.getAll(),
      equipoJugadorModel.listActivosAll(),
    ]);

    // agrupar miembros por equipo
    const map = new Map();
    for (const m of miembrosActivos) {
      if (!map.has(m.id_equipo)) map.set(m.id_equipo, []);
      map.get(m.id_equipo).push({
        id: m.id, // id de equipo_jugador (historial)
        id_jugador: m.id_jugador,
        nickname: m.nickname,
        id_rango: m.id_rango,
        id_rol: m.id_rol,
        fecha_alta: m.fecha_alta,
      });
    }

    const result = equipos.map((e) => ({
      ...e,
      miembros: map.get(e.id) || [],
    }));

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log("LIST EQUIPOS ERROR =>", {
      code: error?.code,
      errno: error?.errno,
      sqlMessage: error?.sqlMessage,
      message: error?.message,
    });

    return res.status(500).json({
      success: false,
      message: "Error al listar equipos",
      detail: {
        code: error?.code,
        sqlMessage: error?.sqlMessage,
      },
    });
  }
};
export const unirse = async (req, res) => {
  try {
    const id_equipo = Number(req.params.id);

    const equipo = await equipoModel.getById(id_equipo);
    if (!equipo) {
      return res
        .status(404)
        .json({ success: false, message: "Equipo no encontrado" });
    }

    const miJugadorId = await getMiJugadorId(req);
    if (!miJugadorId) {
      return res.status(409).json({
        success: false,
        message: "El usuario no tiene perfil jugador",
      });
    }

    const ya = await equipoJugadorModel.existsActivo({
      id_equipo,
      id_jugador: miJugadorId,
    });

    if (ya) {
      return res
        .status(409)
        .json({ success: false, message: "Ya sos miembro de este equipo" });
    }
    const equipoActivoId = await equipoJugadorModel.getEquipoActivoIdByJugador(
      miJugadorId
    );
    if (equipoActivoId && equipoActivoId !== id_equipo) {
      return res.status(409).json({
        success: false,
        message:
          "Ya estás en un equipo. Salí del equipo actual para unirte a otro.",
      });
    }
    const id = await equipoJugadorModel.add({
      id_equipo,
      id_jugador: miJugadorId,
    });

    return res.json({
      success: true,
      message: "Te uniste al equipo",
      id,
    });
  } catch (error) {
    console.log("UNIRSE ERROR =>", {
      code: error?.code,
      errno: error?.errno,
      sqlMessage: error?.sqlMessage,
      message: error?.message,
    });

    return res
      .status(500)
      .json({ success: false, message: "Error al unirse al equipo" });
  }
};
export const getEquipoActual = async (req, res) => {
  try {
    const miJugadorId = await getMiJugadorId(req);
    if (!miJugadorId) {
      return res.status(409).json({
        success: false,
        message: "El usuario no tiene perfil jugador",
      });
    }

    const equipo = await equipoModel.getEquipoActualByJugador(miJugadorId);
    if (!equipo) {
      return res.json({ success: true, result: null });
    }

    const miembros = await equipoJugadorModel.listActivosByEquipo(equipo.id);

    return res.json({
      success: true,
      result: {
        ...equipo,
        miembros: (miembros || []).map((m) => ({
          id: m.id, // id de equipo_jugador
          id_jugador: m.id_jugador,
          nickname: m.nickname,
        })),
      },
    });
  } catch (error) {
    console.log("GET EQUIPO ACTUAL ERROR =>", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener equipo actual" });
  }
};
export const salir = async (req, res) => {
  try {
    const id_equipo = Number(req.params.id);

    const miJugadorId = await getMiJugadorId(req);
    if (!miJugadorId) {
      return res.status(409).json({
        success: false,
        message: "El usuario no tiene perfil jugador",
      });
    }

    const affected = await equipoJugadorModel.baja({
      id_equipo,
      id_jugador: miJugadorId,
    });

    if (!affected) {
      return res.status(409).json({
        success: false,
        message: "No estabas en ese equipo (o ya habías salido).",
      });
    }

    return res.json({ success: true, message: "Saliste del equipo" });
  } catch (error) {
    console.log("SALIR ERROR =>", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al salir del equipo" });
  }
};

export const listMensajes = async (req, res) => {
  try {
    const id_equipo = Number(req.params.id);

    const miJugadorId = await getMiJugadorId(req);
    if (!miJugadorId)
      return res
        .status(409)
        .json({ success: false, message: "Sin perfil jugador" });

    const esMiembro = await equipoJugadorModel.existsActivo({
      id_equipo,
      id_jugador: miJugadorId,
    });
    if (!esMiembro)
      return res
        .status(403)
        .json({ success: false, message: "No sos miembro de este equipo" });

    const mensajes = await equipoMensajeModel.listByEquipo(id_equipo, 50);
    return res.json({ success: true, results: mensajes });
  } catch (e) {
    console.log("LIST MENSAJES ERROR =>", e);
    return res
      .status(500)
      .json({ success: false, message: "Error al listar mensajes" });
  }
};

export const enviarMensaje = async (req, res) => {
  try {
    const id_equipo = Number(req.params.id);
    const { mensaje } = req.body;

    if (!String(mensaje || "").trim()) {
      return res.status(400).json({ success: false, message: "Mensaje vacío" });
    }

    const miJugadorId = await getMiJugadorId(req);
    if (!miJugadorId)
      return res
        .status(409)
        .json({ success: false, message: "Sin perfil jugador" });

    const esMiembro = await equipoJugadorModel.existsActivo({
      id_equipo,
      id_jugador: miJugadorId,
    });
    if (!esMiembro)
      return res
        .status(403)
        .json({ success: false, message: "No sos miembro de este equipo" });

    const id = await equipoMensajeModel.add({
      id_equipo,
      id_jugador: miJugadorId,
      mensaje: String(mensaje).trim(),
    });

    return res.json({ success: true, message: "Mensaje enviado", id });
  } catch (e) {
    console.log("ENVIAR MENSAJE ERROR =>", e);
    return res
      .status(500)
      .json({ success: false, message: "Error al enviar mensaje" });
  }
};

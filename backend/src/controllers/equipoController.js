import * as jugadorModel from "../models/jugadorModel.js";
import * as equipoModel from "../models/equipoModel.js";
import * as equipoJugadorModel from "../models/equipoJugadorModel.js";
import * as equipoMensajeModel from "../models/equipoMensajeModel.js";
import * as estadoEquipoModel from "../models/estadoEquipoModel.js";

const MAX_MIEMBROS = 5;

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
  const { nombre } = req.body;

  if (!String(nombre || "").trim()) {
    return res
      .status(400)
      .json({ success: false, message: "El nombre del equipo es obligatorio" });
  }

  try {
    const miJugadorId = await getMiJugadorId(req);

    if (!miJugadorId) {
      // ✅ importante: devolvemos 409 para que el front muestre el botón a EditPerfil
      return res.status(409).json({
        success: false,
        message: "El usuario no tiene perfil jugador",
        code: "NO_JUGADOR",
      });
    }

    // ✅ estado fijo siempre 1
    const id = await equipoModel.create({
      nombre: String(nombre).trim(),
      id_lider: miJugadorId,
      id_estado: 1,
    });

    // líder como miembro activo
    const yaMiembro = await equipoJugadorModel.existsActivo({
      id_equipo: Number(id),
      id_jugador: Number(miJugadorId),
    });

    if (!yaMiembro) {
      await equipoJugadorModel.add({
        id_equipo: Number(id),
        id_jugador: Number(miJugadorId),
      });
    }

    return res.json({
      success: true,
      message: "Equipo creado correctamente",
      id,
    });
  } catch (error) {
    console.log("CREATE MINE EQUIPO ERROR =>", {
      code: error?.code,
      errno: error?.errno,
      sqlMessage: error?.sqlMessage,
      message: error?.message,
    });

    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Ya existe un equipo con ese nombre",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error al crear equipo",
      detail: { code: error?.code, sqlMessage: error?.sqlMessage },
    });
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
      num_jugadores: (map.get(e.id) || []).length,
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

    // ✅ reglas por estado
    const st = Number(equipo.id_estado);
    if (st === 3)
      return res
        .status(409)
        .json({ success: false, message: "El equipo está cerrado" });
    if (st === 4)
      return res
        .status(409)
        .json({ success: false, message: "El equipo está suspendido" });
    if (st === 2)
      return res
        .status(409)
        .json({ success: false, message: "El equipo ya está completo" });
    if (st !== 1)
      return res
        .status(409)
        .json({ success: false, message: "No se puede unir a este equipo" });

    const miJugadorId = await getMiJugadorId(req);
    if (!miJugadorId) {
      return res.status(409).json({
        success: false,
        message: "El usuario no tiene perfil jugador",
      });
    }

    // ✅ no puede estar en otro equipo activo
    const equipoActivoId = await equipoJugadorModel.getEquipoActivoIdByJugador(
      miJugadorId
    );
    if (equipoActivoId && Number(equipoActivoId) !== id_equipo) {
      return res.status(409).json({
        success: false,
        message:
          "Ya estás en un equipo. Salí del equipo actual para unirte a otro.",
      });
    }

    // ✅ si ya está adentro
    const ya = await equipoJugadorModel.existsActivo({
      id_equipo,
      id_jugador: miJugadorId,
    });
    if (ya) {
      return res
        .status(409)
        .json({ success: false, message: "Ya sos miembro de este equipo" });
    }

    // ✅ cupo por COUNT
    const cantAntes = await equipoJugadorModel.countActivosByEquipo(id_equipo);
    if (cantAntes >= MAX_MIEMBROS) {
      // por consistencia: lo marcamos completo
      await equipoModel.updateEstado(id_equipo, 2);
      return res
        .status(409)
        .json({ success: false, message: "El equipo ya está completo" });
    }

    const id = await equipoJugadorModel.add({
      id_equipo,
      id_jugador: miJugadorId,
    });

    // ✅ si con este ingreso se completó, pasa a estado 2
    const cantDespues = await equipoJugadorModel.countActivosByEquipo(
      id_equipo
    );
    if (cantDespues >= MAX_MIEMBROS) {
      await equipoModel.updateEstado(id_equipo, 2);
    }

    return res.json({ success: true, message: "Te uniste al equipo", id });
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
    console.error("GET EQUIPO ACTUAL ERROR =>");
    console.error(error);
    console.error(error.message);
    console.error(error.stack);

    return res
      .status(500)
      .json({ success: false, message: "Error al obtener equipo actual" });
  }
};

export const salir = async (req, res) => {
  const id_equipo = Number(req.params.id);

  try {
    const miJugadorId = await getMiJugadorId(req);
    if (!miJugadorId) {
      return res.status(409).json({
        success: false,
        message: "El usuario no tiene perfil jugador",
      });
    }

    const equipo = await equipoModel.getById(id_equipo);
    if (!equipo) {
      return res
        .status(404)
        .json({ success: false, message: "Equipo no encontrado" });
    }

    const esLider = Number(equipo.id_lider) === Number(miJugadorId);

    // Si NO es líder: baja normal
    if (!esLider) {
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
      const MAX_MIEMBROS = 5;
      const cant = await equipoJugadorModel.countActivosByEquipo(id_equipo);

      if (Number(equipo.id_estado) === 2 && cant < MAX_MIEMBROS) {
        await equipoModel.updateEstado(id_equipo, 1);
      }

      return res.json({ success: true, message: "Saliste del equipo" });
    }

    // Si es líder: cerrar equipo kick a todos
    const conn = connection.getConnection
      ? await connection.getConnection()
      : connection;
    const release = conn.release ? () => conn.release() : () => {};

    try {
      if (conn.beginTransaction) await conn.beginTransaction();

      await equipoModel.cerrarEquipo(id_equipo, conn);
      await equipoJugadorModel.bajaAllActivosByEquipo(id_equipo, conn);

      if (conn.commit) await conn.commit();

      return res.json({
        success: true,
        message: "Cerraste el equipo y se expulsaron los miembros",
      });
    } catch (err) {
      if (conn.rollback) await conn.rollback();
      console.log("SALIR LIDER ERROR =>", {
        code: err?.code,
        errno: err?.errno,
        sqlMessage: err?.sqlMessage,
        message: err?.message,
      });
      return res
        .status(500)
        .json({ success: false, message: "Error al cerrar el equipo" });
    } finally {
      release();
    }
  } catch (error) {
    console.log("SALIR ERROR =>", {
      code: error?.code,
      errno: error?.errno,
      sqlMessage: error?.sqlMessage,
      message: error?.message,
    });

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

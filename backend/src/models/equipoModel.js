import connection from "../../db.js";
import { formatToday } from "../helpers/dateHelper.js";

export const getAllByLider = async (id_lider) => {
  const q = `
    SELECT id, nombre, id_lider, id_estado, fecha_estado, fecha_creacion, fecha_modificacion
    FROM equipo
    WHERE id_lider = ?
    ORDER BY id DESC
  `;
  const [rows] = await connection.query(q, [id_lider]);
  return rows;
};

export const getById = async (id) => {
  const q = `
    SELECT id, nombre, id_lider, id_estado, fecha_estado, fecha_creacion, fecha_modificacion
    FROM equipo
    WHERE id = ?
  `;
  const [rows] = await connection.query(q, [id]);
  return rows.length ? rows[0] : null;
};

export const create = async ({ nombre, id_lider, id_estado }) => {
  const now = formatToday();
  const q = `
    INSERT INTO equipo(nombre, id_lider, id_estado, fecha_estado, fecha_creacion, fecha_modificacion)
    VALUES(?, ?, ?, ?, ?, ?)
  `;
  const [result] = await connection.query(q, [
    nombre,
    id_lider,
    id_estado,
    now,
    now,
    now,
  ]);
  return result.insertId;
};

export const update = async (id, { nombre, id_estado }) => {
  const now = formatToday();
  const q = `
    UPDATE equipo
    SET nombre = ?, id_estado = ?, fecha_estado = ?, fecha_modificacion = ?
    WHERE id = ?
  `;
  const [result] = await connection.query(q, [nombre, id_estado, now, now, id]);
  return result.affectedRows;
};

export const remove = async (id) => {
  const q = `DELETE FROM equipo WHERE id = ?`;
  const [result] = await connection.query(q, [id]);
  return result.affectedRows;
};

export const getAll = async () => {
  const q = `
    SELECT id, nombre, id_lider, id_estado, fecha_estado, fecha_creacion, fecha_modificacion
    FROM equipo
    ORDER BY id DESC
  `;
  const [rows] = await connection.query(q);
  return rows;
};

export const updateEstado = async (id, id_estado) => {
  const now = formatToday();
  const q = `
    UPDATE equipo
    SET id_estado = ?, fecha_estado = ?, fecha_modificacion = ?
    WHERE id = ?
  `;
  const [result] = await connection.query(q, [id_estado, now, now, id]);
  return result.affectedRows;
};

export const getByIdAndUsuario = async (id_equipo, id_usuario) => {
  const q = `
    SELECT e.id, e.nombre, e.id_lider, e.id_estado,
           e.fecha_estado, e.fecha_creacion, e.fecha_modificacion
    FROM equipo e
    JOIN jugador j ON j.id = e.id_lider
    WHERE e.id = ?
      AND j.id_usuario = ?
  `;
  const [rows] = await connection.query(q, [id_equipo, id_usuario]);
  return rows.length ? rows[0] : null;
};

// ✅ ESTA ES LA FUNCIÓN QUE TE FALTA Y POR ESO ROMPE /me/equipo-actual
export const getEquipoActualByJugador = async (id_jugador) => {
  const q = `
    SELECT
      e.id,
      e.nombre,
      (
        SELECT COUNT(*)
        FROM equipo_jugador ej2
        WHERE ej2.id_equipo = e.id AND ej2.fecha_baja IS NULL
      ) AS num_jugadores,
      e.id_lider,
      j.nickname AS lider_nickname,
      e.id_estado,
      ee.nombre AS estado_nombre,
      e.fecha_creacion,
      e.fecha_modificacion
    FROM equipo_jugador ej
    JOIN equipo e ON e.id = ej.id_equipo
    JOIN jugador j ON j.id = e.id_lider
    JOIN estado_equipo ee ON ee.id = e.id_estado
    WHERE ej.id_jugador = ? AND ej.fecha_baja IS NULL
    ORDER BY ej.fecha_alta DESC
    LIMIT 1
  `;
  const [rows] = await connection.query(q, [id_jugador]);
  return rows.length ? rows[0] : null;
};

// líder sale => estado 3 (cerrado)
export const cerrarEquipo = async (id_equipo, conn = connection) => {
  const now = formatToday();
  const q = `
    UPDATE equipo
    SET id_estado = 3,
        fecha_estado = ?,
        fecha_modificacion = ?
    WHERE id = ?
  `;
  const [result] = await conn.query(q, [now, now, id_equipo]);
  return result.affectedRows;
};

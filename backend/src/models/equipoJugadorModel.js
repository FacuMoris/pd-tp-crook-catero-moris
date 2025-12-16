import connection from "../../db.js";
import { formatToday } from "../helpers/dateHelper.js";

export const listActivosByEquipo = async (id_equipo) => {
  const q = `
    SELECT
      ej.id,
      ej.id_equipo,
      ej.id_jugador,
      ej.fecha_alta,
      ej.fecha_baja,
      j.nickname,
      j.id_rango,
      j.id_rol
    FROM equipo_jugador ej
    JOIN jugador j ON j.id = ej.id_jugador
    WHERE ej.id_equipo = ? AND ej.fecha_baja IS NULL
    ORDER BY ej.fecha_alta ASC
  `;
  const [rows] = await connection.query(q, [id_equipo]);
  return rows;
};

export const listActivosAll = async () => {
  const q = `
    SELECT
      ej.id,
      ej.id_equipo,
      ej.id_jugador,
      ej.fecha_alta,
      ej.fecha_baja,
      j.nickname,
      j.id_rango,
      j.id_rol
    FROM equipo_jugador ej
    JOIN jugador j ON j.id = ej.id_jugador
    WHERE ej.fecha_baja IS NULL
    ORDER BY ej.id_equipo ASC, ej.fecha_alta ASC
  `;
  const [rows] = await connection.query(q);
  return rows;
};

export const existsActivo = async ({ id_equipo, id_jugador }) => {
  const q = `
    SELECT 1
    FROM equipo_jugador
    WHERE id_equipo = ? AND id_jugador = ? AND fecha_baja IS NULL
    LIMIT 1
  `;
  const [rows] = await connection.query(q, [id_equipo, id_jugador]);
  return rows.length > 0;
};

export const countActivosByEquipo = async (id_equipo) => {
  const q = `
    SELECT COUNT(*) AS cant
    FROM equipo_jugador
    WHERE id_equipo = ? AND fecha_baja IS NULL
  `;
  const [rows] = await connection.query(q, [id_equipo]);
  return Number(rows?.[0]?.cant ?? 0);
};

export const add = async ({ id_equipo, id_jugador }) => {
  const now = formatToday();
  const q = `
    INSERT INTO equipo_jugador(id_equipo, id_jugador, fecha_alta, fecha_baja)
    VALUES(?, ?, ?, NULL)
  `;
  const [result] = await connection.query(q, [id_equipo, id_jugador, now]);
  return result.insertId;
};

export const baja = async ({ id_equipo, id_jugador }) => {
  const now = formatToday();
  const q = `
    UPDATE equipo_jugador
    SET fecha_baja = ?
    WHERE id_equipo = ? AND id_jugador = ? AND fecha_baja IS NULL
  `;
  const [result] = await connection.query(q, [now, id_equipo, id_jugador]);
  return result.affectedRows;
};

export const bajaAllActivosByEquipo = async (id_equipo, conn = connection) => {
  const now = formatToday();
  const q = `
    UPDATE equipo_jugador
    SET fecha_baja = ?
    WHERE id_equipo = ? AND fecha_baja IS NULL
  `;
  const [result] = await conn.query(q, [now, id_equipo]);
  return result.affectedRows;
};

export const getEquipoActivoIdByJugador = async (id_jugador) => {
  const q = `
    SELECT id_equipo
    FROM equipo_jugador
    WHERE id_jugador = ? AND fecha_baja IS NULL
    ORDER BY fecha_alta DESC
    LIMIT 1
  `;
  const [rows] = await connection.query(q, [id_jugador]);
  return rows.length ? rows[0].id_equipo : null;
};

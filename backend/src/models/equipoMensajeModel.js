import connection from "../../db.js";
import { formatToday } from "../helpers/dateHelper.js";

export const listByEquipo = async (id_equipo, limit = 50) => {
  const q = `
    SELECT em.id, em.id_equipo, em.id_jugador, em.mensaje, em.fecha_creacion,
           j.nickname
    FROM equipo_mensaje em
    JOIN jugador j ON j.id = em.id_jugador
    WHERE em.id_equipo = ?
    ORDER BY em.fecha_creacion DESC
    LIMIT ?
  `;
  const [rows] = await connection.query(q, [id_equipo, Number(limit)]);
  // lo devolvemos en orden cronológico
  return rows.reverse();
};

export const add = async ({ id_equipo, id_jugador, mensaje }) => {
  const now = formatToday();
  const q = `
    INSERT INTO equipo_mensaje(id_equipo, id_jugador, mensaje, fecha_creacion)
    VALUES(?, ?, ?, ?)
  `;
  const [result] = await connection.query(q, [
    id_equipo,
    id_jugador,
    mensaje,
    now,
  ]);
  return result.insertId;
};

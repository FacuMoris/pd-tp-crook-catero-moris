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
    SELECT e.id, e.nombre, e.id_lider, e.id_estado,
           e.fecha_estado, e.fecha_creacion, e.fecha_modificacion,
           j.nickname AS lider_nickname,
           ee.nombre AS estado_nombre
    FROM equipo e
    JOIN jugador j ON j.id = e.id_lider
    JOIN estado_equipo ee ON ee.id = e.id_estado
    ORDER BY e.id DESC
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

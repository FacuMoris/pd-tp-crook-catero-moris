import connection from "../../db.js";
import { formatToday } from "../helpers/dateHelper.js";

export const getAll = async () => {
  const q = `SELECT id, nombre, descripcion, fecha_creacion, fecha_modificacion FROM rol ORDER BY id`;
  const [rows] = await connection.query(q);
  return rows;
};

export const getById = async (id) => {
  const q = `SELECT id, nombre, descripcion, fecha_creacion, fecha_modificacion FROM rol WHERE id = ?`;
  const [rows] = await connection.query(q, [id]);
  return rows.length ? rows[0] : null;
};

export const create = async ({ nombre, descripcion }) => {
  const q = `
    INSERT INTO rol(nombre, descripcion, fecha_creacion, fecha_modificacion)
    VALUES(?, ?, ?, ?)
  `;
  await connection.query(q, [
    nombre,
    descripcion ?? null,
    formatToday(),
    formatToday(),
  ]);
};

export const update = async (id, { nombre, descripcion }) => {
  const q = `
    UPDATE rol
    SET nombre = ?, descripcion = ?, fecha_modificacion = ?
    WHERE id = ?
  `;
  const [result] = await connection.query(q, [
    nombre,
    descripcion ?? null,
    formatToday(),
    id,
  ]);
  return result.affectedRows;
};

export const remove = async (id) => {
  const q = `DELETE FROM rol WHERE id = ?`;
  const [result] = await connection.query(q, [id]);
  return result.affectedRows;
};

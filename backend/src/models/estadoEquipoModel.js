import connection from "../../db.js";

export const getAll = async () => {
  const q = `SELECT id, nombre FROM estado_equipo ORDER BY id`;
  const [rows] = await connection.query(q);
  return rows;
};

export const getById = async (id) => {
  const q = `SELECT id, nombre FROM estado_equipo WHERE id = ?`;
  const [rows] = await connection.query(q, [id]);
  return rows.length ? rows[0] : null;
};

export const create = async ({ nombre }) => {
  const q = `INSERT INTO estado_equipo(nombre) VALUES(?)`;
  await connection.query(q, [nombre]);
};

export const update = async (id, { nombre }) => {
  const q = `UPDATE estado_equipo SET nombre = ? WHERE id = ?`;
  const [result] = await connection.query(q, [nombre, id]);
  return result.affectedRows;
};

export const remove = async (id) => {
  const q = `DELETE FROM estado_equipo WHERE id = ?`;
  const [result] = await connection.query(q, [id]);
  return result.affectedRows;
};

import connection from "../../db.js";
import { formatToday } from "../helpers/dateHelper.js";
import bcrypt from "bcrypt";

export const create = async ({
  nombre,
  apellido,
  email,
  telefono,
  pass,
  is_admin,
}) => {
  const pass_crypt = await bcrypt.hash(pass, 10);

  const checkEmail = `SELECT 1 FROM usuario WHERE email = ?`;
  const insert = `
    INSERT INTO usuario(nombre, apellido, email, telefono, pass, is_admin, fecha_creacion, fecha_modificacion)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [[dup]] = await connection.query(checkEmail, [email]);
  if (dup) throw new Error("Email existente");

  await connection.query(insert, [
    nombre,
    apellido,
    email,
    telefono ?? null,
    pass_crypt,
    is_admin ? 1 : 0,
    formatToday(),
    formatToday(),
  ]);
};

export const login = async ({ email, pass }) => {
  const query = `
    SELECT id, nombre, apellido, email, pass, is_admin
    FROM usuario
    WHERE email = ?
  `;

  const [results] = await connection.query(query, [email]);
  if (results.length !== 1) return null;

  const usuario = results[0];

  const ok = await bcrypt.compare(pass, usuario.pass);
  if (!ok) return null;

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    is_admin: usuario.is_admin == 1,
  };
};

export const getAll = async () => {
  const q = `
    SELECT id, nombre, apellido, email, telefono, is_admin
    FROM usuario
    ORDER BY id
  `;
  const [rows] = await connection.query(q);
  return rows;
};

export const getById = async (id) => {
  const q = `
    SELECT id, nombre, apellido, email, telefono, is_admin
    FROM usuario
    WHERE id = ?
  `;
  const [rows] = await connection.query(q, [id]);
  return rows.length ? rows[0] : null;
};

export const updateById = async (
  id,
  { nombre, apellido, email, telefono, is_admin }
) => {
  const q = `
    UPDATE usuario
    SET nombre = ?, apellido = ?, email = ?, telefono = ?, is_admin = ?
    WHERE id = ?
  `;
  const [result] = await connection.query(q, [
    nombre,
    apellido,
    email,
    telefono,
    is_admin,
    id,
  ]);
  return result.affectedRows;
};

export const removeById = async (id) => {
  const q = `DELETE FROM usuario WHERE id = ?`;
  const [result] = await connection.query(q, [id]);
  return result.affectedRows;
};

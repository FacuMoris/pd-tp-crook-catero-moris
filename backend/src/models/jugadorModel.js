import connection from "../../db.js";
import { formatToday } from "../helpers/dateHelper.js";

export const getByUsuarioId = async (id_usuario) => {
  const q = `
    SELECT id, id_usuario, nickname, id_rango, id_rol, edad, bio, fecha_creacion, fecha_modificacion
    FROM jugador
    WHERE id_usuario = ?
  `;
  const [rows] = await connection.query(q, [id_usuario]);
  return rows.length ? rows[0] : null;
};

export const createForUsuario = async ({
  id_usuario,
  nickname,
  id_rango,
  id_rol,
  edad,
  bio,
}) => {
  const q = `
    INSERT INTO jugador(id_usuario, nickname, id_rango, id_rol, edad, bio, fecha_creacion, fecha_modificacion)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await connection.query(q, [
    id_usuario,
    nickname,
    id_rango,
    id_rol,
    edad ?? null,
    bio ?? null,
    formatToday(),
    formatToday(),
  ]);
};

export const updateForUsuario = async ({
  id_usuario,
  nickname,
  id_rango,
  id_rol,
  edad,
  bio,
}) => {
  const q = `
    UPDATE jugador
    SET nickname = ?, id_rango = ?, id_rol = ?, edad = ?, bio = ?, fecha_modificacion = ?
    WHERE id_usuario = ?
  `;
  const [result] = await connection.query(q, [
    nickname,
    id_rango,
    id_rol,
    edad ?? null,
    bio ?? null,
    formatToday(),
    id_usuario,
  ]);
  return result.affectedRows;
};

export const deleteForUsuario = async (id_usuario) => {
  const q = `DELETE FROM jugador WHERE id_usuario = ?`;
  const [result] = await connection.query(q, [id_usuario]);
  return result.affectedRows;
};

export const getAll = async () => {
  const q = `
    SELECT j.id, j.nickname, j.edad, j.bio,
           r.nombre AS rango,
           ro.nombre AS rol,
           u.email
    FROM jugador j
    JOIN rango r ON r.id = j.id_rango
    JOIN rol ro ON ro.id = j.id_rol
    JOIN usuario u ON u.id = j.id_usuario
    ORDER BY j.id
  `;
  const [rows] = await connection.query(q);
  return rows;
};

export const getByIdAdmin = async (id) => {
  const q = `
    SELECT j.id, j.nickname, j.edad, j.bio,
           j.id_rango, j.id_rol,
           u.email
    FROM jugador j
    JOIN usuario u ON u.id = j.id_usuario
    WHERE j.id = ?
  `;
  const [rows] = await connection.query(q, [id]);
  return rows.length ? rows[0] : null;
};

export const updateById = async (
  id,
  { nickname, id_rango, id_rol, edad, bio }
) => {
  const q = `
    UPDATE jugador
    SET nickname = ?, id_rango = ?, id_rol = ?, edad = ?, bio = ?, fecha_modificacion = ?
    WHERE id = ?
  `;
  const [result] = await connection.query(q, [
    nickname,
    id_rango,
    id_rol,
    edad ?? null,
    bio ?? null,
    formatToday(),
    id,
  ]);
  return result.affectedRows;
};

export const removeById = async (id) => {
  const q = `DELETE FROM jugador WHERE id = ?`;
  const [result] = await connection.query(q, [id]);
  return result.affectedRows;
};

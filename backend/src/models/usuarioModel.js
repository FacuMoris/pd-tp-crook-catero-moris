const connection = require('../../db')
const { formatToday } = require('../helpers/dateHelper')
const bcrypt = require('bcrypt')

exports.create = async ({
  nombre,
  apellido,
  pass,
  email,
  telefono,
  is_admin
}) => {
  const pass_crypt = await bcrypt.hash(pass, 10)
  const check = `
    SELECT 1 FROM usuario WHERE email = ?`
  const query = `
    INSERT INTO usuario(nombre, apellido, pass, email, telefono, is_admin, activo, fecha_alta, fecha_modif)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

  try {
    const [[dupEmail]] = await connection.query(check, [email])
    if (dupEmail) {
      throw new Error('Email existente')
    }
    results = await connection.query(query, [
      nombre,
      apellido,
      pass_crypt,
      email,
      telefono,
      is_admin ? 1 : 0,
      1,
      formatToday(),
      formatToday()
    ])
    return results
  } catch (error) {
    throw error
  }
}

exports.login = async ({ email, pass }) => {
  const query = `
    SELECT id, nombre, apellido, email, pass, is_admin
    FROM usuario
    WHERE email = ?
    `

  try {
    [results] = await connection.query(query, [email])
    if (results.length == 1) {
      const usuario = results[0]
      const checkPass = await bcrypt.compare(pass, usuario.pass)
      return checkPass ? usuario : null
    } else {
      return null
    }
  } catch (error) {}
}

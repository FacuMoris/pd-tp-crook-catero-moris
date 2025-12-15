import jwt from "jsonwebtoken";
import * as usuarioModel from "../models/usuarioModel.js";

export const register = async (req, res) => {
  const { nombre, apellido, email, telefono, pass } = req.body;

  try {
    await usuarioModel.create({
      nombre,
      apellido,
      email,
      telefono,
      pass,
      is_admin: false,
    });

    res.json({ success: true, message: "Usuario registrado correctamente" });
  } catch (error) {
    if (error.message === "Email existente") {
      return res
        .status(409)
        .json({ success: false, message: "Email existente" });
    }
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error al intentar registrar al usuario",
    });
  }
};

export const login = async (req, res) => {
  const { email, pass } = req.body;

  // validación mínima (evita request vacíos)
  if (!email || !pass) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan credenciales" });
  }

  try {
    const usuario = await usuarioModel.login({ email, pass });

    if (!usuario) {
      return res.json({ success: false, message: "Credenciales incorrectas" });
    }

    const payload = {
      ID: usuario.id,
      nombre: usuario.nombre,
      is_admin: usuario.is_admin,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      nombre: usuario.nombre,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Error al intentar iniciar sesión" });
  }
};

export const welcome = (req, res) => {
  res.json({
    success: true,
    message: `Bienvenida/o ${req.user.nombre}`,
  });
};

export const refreshToken = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Token de autenticación no proporcionado",
    });
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Formato de token inválido",
    });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);

    const payload = {
      ID: usuario.ID,
      nombre: usuario.nombre,
      is_admin: usuario.is_admin,
    };

    const newAccessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token de autenticación inválido",
    });
  }
};
export const logout = (req, res) => {
  return res.json({
    success: true,
    message: "Logout exitoso",
  });
};

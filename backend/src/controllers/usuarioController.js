const usuarioModel = require("../models/usuarioModel");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nombre, apellido, email, pass, telefono } = req.body;
  const is_admin = false;

  try {
    await usuarioModel.create({
      nombre,
      apellido,
      pass,
      email,
      telefono,
      is_admin,
    });
    res.json({ success: true, message: "Usuario registrado correctamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, pass } = req.body;

  try {
    const usuario = await usuarioModel.login({ email, pass });
    if (usuario == null) {
      res.json({ success: false, message: "Credenciales inexistentes" });
    } else {
      const playload = {
        ID: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        is_admin: usuario.is_admin == 1,
      };

      const accessToken = jwt.sign(
        playload,
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        playload,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        success: true,
        message: "Inicio de sesión exitoso",
        accessToken,
        refreshToken,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error al " });
  }
};

exports.refreshToken = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Token de autenticación no proporcionado",
    });
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer != "Bearer" || !token) {
    return res
      .status(401)
      .json({ success: false, message: "Formato de token no válido" });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
    const playload = {
      ID: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      is_admin: usuario.is_admin == 1,
    };

    const newAccessToken = jwt.sign(
      playload,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token de autenticación inválido" });
  }
};

exports.welcome = (req, res) => {
  res.json({ success: true, message: "Bienvenido " + req.user.nombre });
};

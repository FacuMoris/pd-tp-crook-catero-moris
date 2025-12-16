import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as usuarioModel from "../models/usuarioModel.js";

const esEmailValido = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

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
    return res.status(500).json({
      success: false,
      message: "Error al intentar iniciar sesión",
    });
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
      {
        expiresIn: "15m",
      }
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

export const getMe = async (req, res) => {
  try {
    const user = await usuarioModel.getById(req.user.ID);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    return res.json({
      success: true,
      result: user,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error al intentar recuperar el usuario",
    });
  }
};

export const updateMe = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      telefono,
      email,
      passActual,
      passNueva,
      passNueva2,
    } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({
        success: false,
        message: "Nombre y apellido son obligatorios",
      });
    }

    const actual = await usuarioModel.getAuthById(req.user.ID);

    if (!actual) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const quiereCambiarEmail =
      typeof email === "string" &&
      email.trim() !== "" &&
      email.trim() !== actual.email;

    const quiereCambiarPass =
      typeof passNueva === "string" && passNueva.trim() !== "";

    if ((quiereCambiarEmail || quiereCambiarPass) && !passActual) {
      return res.status(400).json({
        success: false,
        message:
          "Para cambiar email o contraseña, ingresá tu contraseña actual",
      });
    }

    if (quiereCambiarEmail || quiereCambiarPass) {
      const ok = await bcrypt.compare(passActual, actual.pass);
      if (!ok) {
        return res.status(400).json({
          success: false,
          message: "La contraseña actual es incorrecta",
        });
      }
    }

    let emailFinal = actual.email;

    if (quiereCambiarEmail) {
      const emailNuevo = email.trim();

      if (!esEmailValido(emailNuevo)) {
        return res.status(400).json({
          success: false,
          message: "Ingresá un email válido",
        });
      }

      const existe = await usuarioModel.emailExists(emailNuevo, req.user.ID);
      if (existe) {
        return res.status(409).json({
          success: false,
          message: "Email existente",
        });
      }

      emailFinal = emailNuevo;
    }

    await usuarioModel.updateProfileById(req.user.ID, {
      nombre,
      apellido,
      email: emailFinal,
      telefono,
    });

    if (quiereCambiarPass) {
      if (!passNueva2 || passNueva !== passNueva2) {
        return res.status(400).json({
          success: false,
          message: "Las contraseñas nuevas no coinciden",
        });
      }

      if (String(passNueva).length < 4) {
        return res.status(400).json({
          success: false,
          message: "La contraseña nueva es muy corta",
        });
      }

      await usuarioModel.updatePasswordById(req.user.ID, passNueva);
    }

    const updated = await usuarioModel.getById(req.user.ID);

    return res.json({
      success: true,
      result: updated,
      message: "Usuario actualizado",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error al intentar actualizar el usuario",
    });
  }
};

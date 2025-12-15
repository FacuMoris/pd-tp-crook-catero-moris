export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.is_admin !== true) {
    return res
      .status(403)
      .json({ success: false, message: "Acceso denegado." });
  }
  next();
};

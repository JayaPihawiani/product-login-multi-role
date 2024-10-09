import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.uid)
    return res.status(401).json({ msg: "Mohon login ke akun anda." });
  const user = await User.findOne({ where: { id: req.session.uid } });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  req.uid = user.id;
  req.role = user.role;
  next();
};

export const adminAuth = async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.session.uid } });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan." });
  if (user.role !== "admin")
    return res.status(403).json({ msg: "Akses terlarang" });
  next();
};

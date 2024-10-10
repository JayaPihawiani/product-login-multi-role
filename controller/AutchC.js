import argon2 from "argon2";
import User from "../models/UserModel.js";

export const loginUser = async (req, res) => {
  try {
    const response = await User.findOne({ where: { email: req.body.email } });
    if (!response)
      return res.status(404).json({ msg: "Email tidak terdaftar" });
    const match = await argon2.verify(response.password, req.body.password);
    if (!match)
      return res.status(400).json({ msg: "Password yang dimasukkan salah." });
    req.session.uid = response.id;
    const { id, name, email, role } = response.dataValues;
    res.status(200).json({ id, name, email, role });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const UserInfo = async (req, res) => {
  if (!req.session.uid)
    return res.status(401).json({ msg: "Mohon lakukan login kembali." });
  const user = await User.findOne({
    where: { id: req.session.uid },
    attributes: ["id", "name", "email", "role"],
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Gagal melakukan logout" });
    res.status(200).json({ msg: "Anda telah logout." });
  });
};

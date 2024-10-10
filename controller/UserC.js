import argon2 from "argon2";
import User from "../models/UserModel.js";

export const getUser = async (req, res) => {
  try {
    const user = await User.findAll({
      attributes: ["id", "name", "email", "role"],
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      attributes: ["id", "name", "email", "role"],
    });
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, role, confirmPass } = req.body;
  if (name && email && password && role && confirmPass) {
    if (confirmPass !== password) {
      return res.status(400).json({ msg: "Konfirmasi password anda salah!" });
    }

    if (await User.findOne({ where: { email: req.body.email } })) {
      return res.status(400).json({ msg: "Email ini sudah terdaftar!" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: "Password terlalu pendek. Minimal harus 8 karakter" });
    }

    const hashed = await argon2.hash(password);

    try {
      const user = await User.create({
        name,
        email,
        password: hashed,
        role,
      });
      const { password, createdAt, updatedAt, ...userWithoutPassword } =
        user.dataValues;
      res
        .status(201)
        .json({ msg: "Register berhasil.", data: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  } else {
    res.status(400).json({ msg: "Field ada yang kosong!" });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } });
  let hashed;
  const { name, password, confirmPass } = req.body;
  if (!user) {
    return res.status(404).json({ msg: "User tidak ditemukan" });
  }
  if (password !== confirmPass) {
    return res.status(400).json({ msg: "Konfirmasi password salah" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: "Password terlalu pendek. Minimal harus 8 karakter" });
  }

  hashed = await argon2.hash(password);

  try {
    const updateUser = await user.update(
      { name, password: hashed },
      { where: { id: user.id } }
    );
    const { password, createdAt, updatedAt, ...userWithoutPassword } =
      updateUser.dataValues;
    res
      .status(200)
      .json({ msg: "Berhasil update data", data: userWithoutPassword });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } });
  if (!user) {
    return res.status(404).json({ msg: "User tidak ditemukan" });
  }

  try {
    await user.destroy({ where: { id: user.id } });
    res.status(200).json({ msg: "Berhasil delete data" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

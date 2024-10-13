import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getProduct = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Product.findAll({
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
        attributes: ["id", "name", "price"],
      });
    } else {
      response = await Product.findAll({
        where: { userID: req.uid },
        include: [{ model: User, attributes: ["name", "email"] }],
        attributes: ["id", "name", "price"],
      });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({ where: { id: req.params.id } });
    if (!response) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let product;
    if (req.role === "admin") {
      product = await Product.findOne({
        attributes: ["id", "name", "price"],
        where: { id: response.id },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      product = await Product.findOne({
        attributes: ["id", "name", "price"],
        where: { [Op.and]: [{ id: response.id, userID: req.uid }] },
        include: [{ model: User, attributes: ["name", "email"] }],
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res
      .status(400)
      .json({ msg: "Field ada yang kosong. Harap cek ulang field." });
  }
  try {
    await Product.create({ name, price, userID: req.uid });
    res.status(201).json({ msg: "Berhasil menambah product." });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const response = await Product.findOne({ where: { id: req.params.id } });
    if (!response)
      return res.status(404).json({ msg: "Data tidak ditemukan." });
    const { name, price } = req.body;
    if (!name || !price)
      return res.status(400).json({ msg: "Field ada yang kosong." });
    if (req.role === "admin") {
      await Product.update({ name, price }, { where: { id: response.id } });
    } else {
      if (req.uid !== response.userID)
        return res.status(403).json({ msg: "Akses terlarang." });

      await Product.update(
        { name, price },
        { where: { [Op.and]: [{ id: response.id, userID: req.uid }] } }
      );
    }
    res.status(200).json({ msg: "Berhasil mengupdate data." });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const response = await Product.findOne({ where: { id: req.params.id } });
    if (!response)
      return res.status(404).json({ msg: "Data tidak ditemukan." });
    if (req.role === "admin") {
      await Product.destroy({ where: { id: response.id } });
    } else {
      if (req.uid !== response.userID)
        return res.status(403).json({ msg: "Akses terlarang." });

      await Product.destroy({
        where: { [Op.and]: [{ id: response.id, userID: req.uid }] },
      });
    }
    res.status(200).json({ msg: "Berhasil menghapus data." });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

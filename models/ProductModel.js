import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const Product = db.define(
  "product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },

  {
    freezeTableName: true,
  }
);

User.hasMany(Product, { foreignKey: "userID", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "userID" });

export default Product;

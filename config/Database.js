import { Sequelize } from "sequelize";

const db = new Sequelize("auth-db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;

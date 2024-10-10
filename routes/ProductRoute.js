import express from "express";
import {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/ProductC.js";
import { verifyUser } from "../middleware/AuthM.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(verifyUser, getProduct)
  .post(verifyUser, createProduct);
productRouter
  .route("/:id")
  .get(verifyUser, getProductById)
  .delete(verifyUser, deleteProduct)
  .patch(verifyUser, updateProduct);

export default productRouter;

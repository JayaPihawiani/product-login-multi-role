import express from "express";
import {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/ProductC.js";

const productRouter = express.Router();

productRouter.route("/").get(getProduct).post(createProduct);
productRouter
  .route("/:id")
  .get(getProductById)
  .delete(deleteProduct)
  .patch(updateProduct);

export default productRouter;

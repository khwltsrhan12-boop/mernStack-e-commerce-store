import express from "express";
import formmidble from 'express-formidable'
import {authenticate ,authorizeAdmin} from '../middlewares/authMiddleware.js'
import checkId from "../middlewares/checkId.js";
import { addProduct,updateProductDetails 
  ,removeProduct,fetchProducts 
  ,fetchProductById ,fetchAllProducts
  ,addProductReview ,fetchTopProducts
  ,fetchNewProducts ,filterProducts} from "../controllers/productController.js";

const router = express.Router();

router.route('/allproducts').get(fetchAllProducts)
router.get('/top',fetchTopProducts)
router.get('/new',fetchNewProducts)
router.route('/:id/reviews').post(authenticate,checkId,addProductReview)
router.route('/').get(fetchProducts).post(authenticate,authorizeAdmin,formmidble(),addProduct)
router.route('/:id').put(authenticate,authorizeAdmin,formmidble(),updateProductDetails)
                    .delete(authenticate ,authorizeAdmin,removeProduct)
                    .get(fetchProductById)

router.route('/filtered-products').post(filterProducts)                   
export default router;

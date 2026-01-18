import { Request, Response } from 'express'
import { IProductInput, IProductUpdate, ProductFilters } from '../types/product.types'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, ValidationError } from '../utils/customErrors'
import { ProductService } from '../services/productService'
import { Product } from '../models/Product'
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: stockStatus
 *         schema:
 *           type: string
 *           enum: [in-stock, low-stock, out-of-stock]
 *         description: Filter by stock status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *     responses:
 *       200:
 *         description: Success
 */
export const getAllProducts = asyncHandler(async (req, res) => {
   // 1. Parse query params

   const filters: ProductFilters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      category: req.query.category as string,
      stockStatus: req.query.stockStatus as any,
      search: req.query.search as string,
   }

   const result = await ProductService.getAllProducts(filters)

   // 5. Return response
   res.status(200).json({
      success: true,
      data: result,
   })
})

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Product not found
 */
export const getProductById = asyncHandler(async (req, res) => {
   const { id } = req.params

   const product = await ProductService.getProductById(id as string)



   res.status(200).json({
      success: true,
      data: product,
   })
})

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *               unit:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 */
export const createProduct = asyncHandler(async (req, res) => {
   const productData: IProductInput = req.body

   const product = await ProductService.createProduct(productData)

   res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: product,
   })
})

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
export const updateProduct = asyncHandler(async (req, res) => {
   const { id } = req.params
   const updateData = req.body

   const product = await ProductService.updateProduct(id as string, updateData)

   res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: product,
   })
})

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
export const deleteProduct = asyncHandler(async (req, res) => {
   const { id } = req.params

   await ProductService.deleteProduct(id as string)

   res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm thành công',
   })
})


/**
 * Test instance method
 */
export const checkLowStock = asyncHandler(async (req, res) => {
   const { id } = req.params

   const product = await Product.findById(id)

   if (!product) {
      throw new NotFoundError('Product not found')
   }

   // Call instance method
   const isLow = product.isLowStock()

   res.json({
      success: true,
      data: {
         name: product.name,
         stock: product.stock,
         isLowStock: isLow,
         message: isLow ? 'Sắp hết hàng!' : 'Còn đủ hàng'
      }
   })
})

/**
 * Get low stock products
 */
export const getLowStockProducts = asyncHandler(async (req, res) => {
   // Call static method
   const products = await Product.findLowStock()

   res.json({
      success: true,
      count: products.length,
      data: products
   })
})

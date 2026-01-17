import { Request, Response } from 'express'
import { Product } from '../models/Product'
import { IProductInput, IProductUpdate } from '../types/product.types'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, ValidationError } from '../utils/customErrors'

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
   const page = parseInt(req.query.page as string) || 1
   const limit = parseInt(req.query.limit as string) || 10
   const skip = (page - 1) * limit

   const category = req.query.category as string
   const stockStatus = req.query.stockStatus as string
   const search = req.query.search as string

   // 2. Build filter object
   const filter: any = { isActive: true }

   // Category filter
   if (category) {
      filter.category = category
   }

   // Stock status filter
   if (stockStatus === 'out-of-stock') {
      filter.stock = 0
   } else if (stockStatus === 'low-stock') {
      filter.stock = { $gt: 0, $lt: 20 }
   } else if (stockStatus === 'in-stock') {
      filter.stock = { $gte: 20 }
   }

   // Search filter (case-insensitive regex)
   if (search) {
      filter.name = { $regex: search, $options: 'i' }
   }

   // 3. Fetch products với filter
   const products = await Product.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })

   // 4. Count total documents với filter
   const total = await Product.countDocuments(filter)

   // 5. Return response
   res.status(200).json({
      success: true,
      data: {
         products,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
         },
      },
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
   const product = await Product.findById(id)

   if (!product) {
      throw new NotFoundError('Không tìm thấy sản phẩm')
   }

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

   if (!req.body.name) {
      throw new ValidationError('Tên sản phẩm là bắt buộc nha bạn')
   }

   // Tạo sản phẩm mới
   const product = await Product.create(productData)

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
   const updateData: IProductUpdate = req.body

   const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
   })

   if (!product) {
      throw new NotFoundError('Không tìm thấy sản phẩm')
   }

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

   // Soft delete - chỉ set isActive = false
   const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
   )

   if (!product) {
      throw new NotFoundError('Không tìm thấy sản phẩm')
   }

   res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm thành công',
      data: product,
   })
})

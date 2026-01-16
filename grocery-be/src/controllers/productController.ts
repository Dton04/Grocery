import { Request, Response } from 'express'
import { Product } from '../models/Product'
import { IProductInput, IProductUpdate } from '../types/product.types'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, ValidationError } from '../utils/customErrors'

/**
 * @desc    Lấy tất cả sản phẩm
 * @route   GET /api/products
 * @access  Public
 */
export const getAllProducts = asyncHandler(async (req, res) => {
   // Query parameters
   const page = parseInt(req.query.page as string) || 1
   const limit = parseInt(req.query.limit as string) || 10
   const skip = (page - 1) * limit

   // Lấy sản phẩm với phân trang
   const products = await Product.find({ isActive: true })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })

   // Đếm tổng số sản phẩm
   const total = await Product.countDocuments({ isActive: true })

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
 * @desc    Lấy sản phẩm theo ID
 * @route   GET /api/products/:id
 * @access  Public
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
 * @desc    Tạo sản phẩm mới
 * @route   POST /api/products
 * @access  Private (Admin)
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
 * @desc    Cập nhật sản phẩm
 * @route   PUT /api/products/:id
 * @access  Private (Admin)
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
 * @desc    Xóa sản phẩm (soft delete)
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
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

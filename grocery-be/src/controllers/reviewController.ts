import { Product } from '../models/Product'
import { Review } from '../models/Review'
import { asyncHandler } from '../utils/asyncHandler'
import { ValidationError, NotFoundError, UnauthorizedError } from '../utils/customErrors'

/**
 * @desc    Tạo review cho sản phẩm
 * @route   POST /api/reviews/products/:productId
 * @access  Private
 */
export const createReview = asyncHandler(async (req, res) => {
   const { rating, comment } = req.body
   const { productId } = req.params

   // Validation
   if (!rating || !comment) {
      throw new ValidationError('Vui lòng nhập rating và comment')
   }
   if (rating < 1 || rating > 5) {
      throw new ValidationError('Rating phải từ 1-5')
   }

   // Kiểm tra product có tồn tại không
   const product = await Product.findById(productId)
   if (!product) {
      throw new NotFoundError('Không tìm thấy sản phẩm')
   }

   // Kiểm tra user đã review chưa
   const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id
   })
   if (existingReview) {
      throw new ValidationError('Bạn đã review sản phẩm này rồi')
   }

   // Tạo review
   const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment
   })

   // Populate user và product
   await review.populate('user', 'fullName email')
   await review.populate('product', 'name image')

   res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
   })
})

/**
 * @desc    Lấy reviews của sản phẩm
 * @route   GET /api/reviews/products/:productId
 * @access  Public
 */
export const getProductReviews = asyncHandler(async (req, res) => {
   const { productId } = req.params

   // Check product có không
   const product = await Product.findById(productId)
   if (!product) {
      throw new NotFoundError('Không tìm thấy sản phẩm')
   }

   // Lấy reviews
   const reviews = await Review.find({ product: productId })
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })

   res.status(200).json({
      success: true,
      message: 'Get reviews successfully',
      count: reviews.length,
      data: reviews
   })
})

/**
 * @desc    Xóa review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = asyncHandler(async (req, res) => {
   const { id } = req.params

   const review = await Review.findById(id)
   if (!review) {
      throw new NotFoundError('Không tìm thấy review')
   }

   // Kiểm tra quyền (admin hoặc chính user tạo review)
   if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
   ) {
      throw new UnauthorizedError('Bạn không có quyền xóa review này')
   }

   // Xóa
   await review.deleteOne()

   res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
   })
})
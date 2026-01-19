import Joi from 'joi'
import { vietnameseMessages } from './messages'

export const createProductSchema = Joi.object({
   name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .label('Tên sản phẩm'),
   description: Joi.string()
      .required()
      .label('Mô tả sản phẩm'),
   price: Joi.number()
      .min(0)
      .required()
      .label('Giá sản phẩm'),
   category: Joi.string().required().label('Danh mục'),
   stock: Joi.number().min(0).required().label('Số lượng tồn kho'),
   imageUrl: Joi.string().uri().optional().label('URL hình ảnh'),
   unit: Joi.string().valid('kg', 'gram', 'lít', 'chai', 'bịch', 'gói', 'bộ').required().label('Đơn vị'),
}).messages(vietnameseMessages)

export const updateProductSchema = Joi.object({
   name: Joi.string().min(3).max(100).label('Tên sản phẩm'),
   description: Joi.string().label('Mô tả sản phẩm'),
   price: Joi.number().min(0).label('Giá sản phẩm'),
   category: Joi.string().label('Danh mục'),
   stock: Joi.number().min(0).label('Số lượng tồn kho'),
   imageUrl: Joi.string().uri().optional().label('URL hình ảnh'),
   unit: Joi.string().valid('kg', 'gram', 'lít', 'chai', 'bịch', 'gói', 'bộ').optional(),
}).min(1).messages(vietnameseMessages)

export const getProductsQuerySchema = Joi.object({
   page: Joi.number().integer().min(1).optional(),
   limit: Joi.number().integer().min(1).max(100).optional(),
   category: Joi.string().optional(),
   stockStatus: Joi.string().valid('in-stock', 'low-stock', 'out-of-stock').optional(),
   search: Joi.string().optional(),
}).messages(vietnameseMessages)
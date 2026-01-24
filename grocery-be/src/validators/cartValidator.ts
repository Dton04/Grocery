import Joi from 'joi'
import { vietnameseMessages } from './messages'

export const addToCartSchema = Joi.object({
   productId: Joi.string()
      .label('ID sản phẩm')
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/),
   quantity: Joi.number()
      .label('Số lượng')
      .min(1)
      .max(100)
      .integer()
      .required(),

}).messages(vietnameseMessages)

export const updateCartItemSchema = Joi.object({
   quantity: Joi.number()
      .label('Số lượng')
      .min(1)
      .max(100)
      .integer()
      .required(),
}).messages(vietnameseMessages)

export const removeCartItemSchema = Joi.object({
   productId: Joi.string()
      .label('ID sản phẩm')
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/),
}).messages(vietnameseMessages)





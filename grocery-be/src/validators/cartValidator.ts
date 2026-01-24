import Joi from 'joi'
import { vietnameseMessages } from './messages'

export const addToCartSchema = Joi.object({
   productId: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/),
   quantity: Joi.number()
      .min(1)
      .max(100)
      .integer()
      .required(),

}).messages(vietnameseMessages)

export const updateCartItemSchema = Joi.object({
   quantity: Joi.number()
      .min(1)
      .max(100)
      .integer()
      .required(),
}).messages(vietnameseMessages)

export const removeCartItemSchema = Joi.object({
   productId: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/),
}).messages(vietnameseMessages)





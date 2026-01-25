import Joi from "joi";
import { vietnameseMessages } from "./messages";

export const addToWishlistSchema = Joi.object({
   productId: Joi.string()
      .label('ID sản phẩm')
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)

}).messages(vietnameseMessages)

export const productIdParamSchema = Joi.object({
   productId: Joi.string()
      .label('ID sản phẩm')
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
}).messages(vietnameseMessages)


export const removeFromWishlistSchema = Joi.object({
   productId: Joi.string()
      .label('ID sản phẩm')
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)

}).messages(vietnameseMessages)


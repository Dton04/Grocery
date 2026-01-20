import { Category } from "../models/Category";
import Joi from "joi";
const uniqueCategoryValidator = async (value: string, helpers: Joi.CustomHelpers) => {
   //Check category xem có ko
   const exists = await Category.findOne({ name: value })
   if (exists) {
      return helpers.error('any.invalid', { message: 'Danh mục đã tồn tại' })
   }
   return value
}

export const createCategorySchema = Joi.object({
   name: Joi.string()
      .min(3)
      .max(50)
      .external(uniqueCategoryValidator) //async validator
      .messages({
         'any.invalid': 'Danh mục đã tồn tại'
      })
      .required()
})
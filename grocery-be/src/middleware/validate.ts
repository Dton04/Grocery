import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { ValidationError } from '../utils/customErrors'

export const validate = (schema: Joi.ObjectSchema) => {
   return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body, {
         abortEarly: false, // Trả về TẤT CẢ errors
         stripUnknown: true, // Xóa fields không có trong schema
      })
      if (error) {
         // TODO: Format errors thành array
         const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
         }))

         // TODO: Return structured response
         return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
         })
      }

      next()
   }
}

// bai 2 validate query params
export const validateQuery = (schema: Joi.ObjectSchema) => {
   return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.query, {
         abortEarly: false,
         stripUnknown: true,
      })
      if (error) {
         const message = error.details.map((d) => d.message).join(', ')
         return next(new ValidationError(message))
      }
      next()
   }
}
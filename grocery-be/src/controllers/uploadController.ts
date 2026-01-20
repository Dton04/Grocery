import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import cloudinary from "../config/cloudinary";
import fs from 'fs'

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
   if (!req.file) {
      res.status(400).json({
         success: false,
         message: "Please upload a file"
      })
      return
   }
   //Dùng choo upload local
   // const fileUrl = `/uploads/${req.file.filename}`

   //Cloudinary
   const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'grocery-products',
      transformation: [
         {
            width: 800,
            height: 800,
            crop: 'limit' //resize ảnh nhưng vẫn giữ nguyên tỉ lệ
         }
      ]
   })
   //Xóa local file
   fs.unlinkSync(req.file.path)

   res.status(200).json({
      success: true,
      message: 'Upload file thành công',
      data: {
         filename: req.file.filename,
         url: result.secure_url,
         publicId: result.public_id, // HTTPS URL
         size: req.file.size,
         mimetype: req.file.mimetype
      }
   })
})
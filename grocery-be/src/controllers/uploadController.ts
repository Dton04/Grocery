import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
   if (!req.file) {
      res.status(400).json({
         success: false,
         message: "Please upload a file"
      })
      return
   }

   const fileUrl = `/uploads/${req.file.filename}`

   res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
         filename: req.file.filename,
         url: fileUrl,
         size: req.file.size,
         mimetype: req.file.mimetype
      }
   })
})
import multer from 'multer'
import cloudinary from 'cloudinary'

// Config storage
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/')
   },
   // timestamp - originalname
   filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`
      cb(null, uniqueName)
   }

})


//File filter 
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
   if (file.mimetype.startsWith('image/')) {
      cb(null, true)
   } else {
      cb(new Error('Only image files are allowed'))
   }
}

export const upload = multer({
   storage,
   fileFilter,
   limits: {
      fileSize: 1024 * 1024 * 5 // 5MB là max
   }
})
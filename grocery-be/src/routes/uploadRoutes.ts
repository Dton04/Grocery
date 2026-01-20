import express from "express";
import { uploadImage } from "../controllers/uploadController";
import { upload } from "../middleware/upload";
import { protect } from "../middleware/auth"
import { authorize } from "../middleware/authorize";


const router = express.Router()

/** 
 * @desc Upload single image
 * @route POST /api/upload
 * @access Private
 * @param {string} image - The image to upload
*/

router.post('/',
   protect,
   authorize('admin'),
   upload.single('image'),
   uploadImage
)

export default router
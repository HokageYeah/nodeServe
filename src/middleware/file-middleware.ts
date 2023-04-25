import multer from 'multer';
import path from "path";
import { UPLOAD_PATH } from '@/config/path'
// 单独定义上传的中间件
const filesPath = path.resolve(__dirname, "../../uploads");
const uploadAvatar = multer({ dest: UPLOAD_PATH });

export const handleAvatar = uploadAvatar.single('avatar')

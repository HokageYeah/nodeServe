import multer from 'multer';
import path from "path";

// 单独定义上传的中间件
const filesPath = path.resolve(__dirname, "../../uploads");
const uploadAvatar = multer({ dest: 'uploads/' });

export const handleAvatar = uploadAvatar.single('avatar')

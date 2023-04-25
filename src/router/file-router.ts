import express from "express";
import { Router } from "express";
import FilesController from "@/router_handler/file_handler";
import { userCommentValidatorAry } from "@/middleware/users-article";
import { verifyPermission } from "@/middleware/permission-middleware"
import { handleAvatar } from '@/middleware/file-middleware'

// 定义接口路径前缀
const apiPrefix = "/permissions/file";
// 创建路由对象
const userComenrRouter: Router = express.Router();
// 添加 '/user' 前缀
userComenrRouter.use(apiPrefix, (req, res, next) => {
    next();
});

// 上传头像
userComenrRouter.post(
    apiPrefix + "/user_avatar",
    handleAvatar,
    FilesController.uploadFile
);
module.exports = userComenrRouter;

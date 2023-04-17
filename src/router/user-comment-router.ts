import express from "express";
import { Router } from "express";
import UserCommentController from "@/router_handler/user_comment_handler";
import { userCommentParamsVerify } from "@/middleware/comment-params-middleware";
import { verifyPermission } from "@/middleware/permission-middleware"
// 定义接口路径前缀
const apiPrefix = "/permissions/user";
// 创建路由对象
const userCommentRouter: Router = express.Router();
// 添加 '/user' 前缀
userCommentRouter.use(apiPrefix, (req, res, next) => {
  next();
});

// 创建用户评论，只要登陆的用户都可以评论
userCommentRouter.post(
  apiPrefix + "/create-user-comment",
  userCommentParamsVerify,
  UserCommentController.createUserComment
);
module.exports = userCommentRouter;

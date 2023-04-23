import express from "express";
import { Router } from "express";
import LabelController from "@/router_handler/label_handler";
import { userCommentValidatorAry } from "@/middleware/users-article";
import { verifyPermission } from "@/middleware/permission-middleware"
// 定义接口路径前缀
const apiPrefix = "/permissions";
// 创建路由对象
const userComenrRouter: Router = express.Router();
// 添加 '/user' 前缀
userComenrRouter.use(apiPrefix, (req, res, next) => {
  next();
});

// 创建标签
userComenrRouter.post(
  apiPrefix + "/create-label",
  userCommentValidatorAry('name'),
  LabelController.createLabel
);
module.exports = userComenrRouter;

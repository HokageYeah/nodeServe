import express from "express";
import { Router } from "express";
import UserMomentsController from "@/router_handler/user_moments_handler";
import { userContentValidatorAry } from "@/middleware/users-article";
// 定义接口路径前缀
const apiPrefix = "/permissions/user";
// 创建路由对象
const userComenrRouter: Router = express.Router();
// 添加 '/user' 前缀
userComenrRouter.use(apiPrefix, (req, res, next) => {
  next();
});

// 获取用户动态
userComenrRouter.post(
  apiPrefix + "/get-user-moments",
  userContentValidatorAry,
  UserMomentsController.getUserComents
);
// 添加用户动态
userComenrRouter.post(
  apiPrefix + "/create-user-moments",
  userContentValidatorAry,
  UserMomentsController.getUserComents
);
module.exports = userComenrRouter;

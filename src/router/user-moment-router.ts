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

// 添加用户动态
userComenrRouter.post(
  apiPrefix + "/create-user-moments",
  userContentValidatorAry,
  UserMomentsController.createUserComents
);
// 获取用户动态列表
userComenrRouter.post(
  apiPrefix + "/get-user-moments",
  UserMomentsController.getUserComentsList
);
// 获取用户动态详情
userComenrRouter.post(
  apiPrefix + "/get-user-moments-details",
  UserMomentsController.getUserComentsDetails
);
// 修改用户动态 需要添加当前登陆的用户是否有操作该资源的权限
// userComenrRouter.post(
//   apiPrefix + "/revise-user-moments",
//   UserMomentsController.reviseUserComents
// );

// 删除用户动态 需要添加当前登陆的用户是否有操作该资源的权限
// userComenrRouter.post(
//   apiPrefix + "/delete-user-moments",
//   UserMomentsController.deleteUserComents
// );
module.exports = userComenrRouter;

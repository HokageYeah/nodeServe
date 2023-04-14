import express from "express";
import { Router } from "express";
import UserInfoController from "@/router_handler/user_info_handler";

// 定义接口路径前缀
const apiPrefix = "/permissions/user";
// 创建路由对象
const userInfoRouter: Router = express.Router();
// 添加 '/user' 前缀
userInfoRouter.use(apiPrefix, (req, res, next) => {
  next();
});
// 获取用户信息
userInfoRouter.post(
  apiPrefix + "/get-user-info",
  UserInfoController.getUserInfo
);

// 将路由对象共享出去
// 使用es6这种方式导出 有问题：错误级别的中间件无法调用到， postman报错<pre>[object Object]</pre>
// export default userInfoRouter;
module.exports = userInfoRouter;

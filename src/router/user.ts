import express from "express";
import {
  userLogin,
  userRegister,
  useResetPassword,
} from "@/router_handler/user_handler";
import { Router } from "express";
import { validatorAry } from "@/schema/users-article";
// const validatorAry = require("@/schema/users-article");
// 定义接口路径前缀
const apiPrefix = "/user";
// 创建路由对象
const userRouter: Router = express.Router();

// 添加 '/user' 前缀
userRouter.use(apiPrefix, (req, res, next) => {
  next();
});
// 登陆
userRouter.post(apiPrefix + "/login", validatorAry, userLogin);

// 注册
userRouter.post(apiPrefix + "/register", validatorAry, userRegister);

// 重置密码
userRouter.post(apiPrefix + "/reset-password", validatorAry, useResetPassword);

// 将路由对象共享出去
export { userRouter };

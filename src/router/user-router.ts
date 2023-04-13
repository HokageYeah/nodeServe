import express from "express";
import userController from "@/router_handler/user_handler";
import { Router } from "express";
import { validatorAry } from "@/middleware/users-article";
// const validatorAry = require("@/schema/users-article");
// const { userLogout } = require('@/router_handler/user_handler')
// 定义接口路径前缀
const apiPrefix = "/user";
// 创建路由对象
const userRouter: Router = express.Router();

// 添加 '/user' 前缀
userRouter.use(apiPrefix, (req, res, next) => {
  next();
});
// 登陆
userRouter.post(apiPrefix + "/login", validatorAry, userController.userLogin.bind(userController));

// 注册
userRouter.post(apiPrefix + "/register", validatorAry, userController.userRegister.bind(userController));

// 重置密码
userRouter.post(apiPrefix + "/reset-password", validatorAry, userController.useResetPassword.bind(userController));

// 退出登录
userRouter.post(apiPrefix + "/logout", userController.userLogout);

// 将路由对象共享出去
export { userRouter };

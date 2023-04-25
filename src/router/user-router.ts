import express from "express";
import userController from "@/router_handler/user_handler";
import { Router } from "express";
import {
  loginValidatorAry,
  resetPasswordValidatorAry,
} from "@/middleware/users-article";
// const validatorAry = require("@/schema/users-article");
// const { userLogout } = require('@/router_handler/user_handler')
// 定义接口路径前缀
const apiPrefix = "/api/user";
// 创建路由对象
const userRouter: Router = express.Router();

// 添加 '/user' 前缀
userRouter.use(apiPrefix, (req, res, next) => {
  next();
});
// 登陆
userRouter.post(
  apiPrefix + "/login",
  loginValidatorAry,
  userController.userLogin.bind(userController)
);

// 注册
userRouter.post(
  apiPrefix + "/register",
  loginValidatorAry,
  userController.userRegister.bind(userController)
);

// 重置密码
userRouter.post(
  apiPrefix + "/reset-password",
  resetPasswordValidatorAry,
  userController.useResetPassword.bind(userController)
);

// 退出登录
userRouter.post(apiPrefix + "/logout", userController.userLogout);

// 获取用户头像，get请求
userRouter.get(apiPrefix + "/avatar/:userid", userController.showAvatarImage);


userRouter.use((req, res, next) => {
  console.log("这个是错误级别的中间件哈哈哈哈哈==========>");
});
// 将路由对象共享出去
// 使用es6这种方式导出 有问题：错误级别的中间件无法调用到， postman报错<pre>[object Object]</pre>
// export default userRouter;
module.exports = userRouter;

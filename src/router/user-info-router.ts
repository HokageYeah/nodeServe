import express from "express";
import { Router } from "express";
import { getUserInfo } from "@/router_handler/user_info_handler";

// 定义接口路径前缀
const apiPrefix = "/user";
// 创建路由对象
const userInfoRouter: Router = express.Router();

// 获取用户信息
userInfoRouter.post(apiPrefix + "/get-user-info", getUserInfo);

// 将路由对象共享出去
export { userInfoRouter };

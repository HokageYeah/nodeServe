import express from "express";
import { Router } from "express";
import ServerSentEventsController from "@/router_handler/server_sent_events_handler";

// 定义接口路径前缀
const apiPrefix = "/api";
// 创建路由对象
const userComenrRouter: Router = express.Router();
// 添加 '/user' 前缀
userComenrRouter.use(apiPrefix, (req, res, next) => {
  next();
});

// 上传头像
userComenrRouter.get(
  apiPrefix + "/stream",
  ServerSentEventsController.getStream
);

userComenrRouter.post(
  apiPrefix + "/streamData",
  ServerSentEventsController.postStreamData
);
module.exports = userComenrRouter;

import express from "express";
import { Router, Request, Response } from "express";
import yyconnection from "./tools/mysql_db";

const path = require("path");
const app = express();
// 设置static中间件后，浏览器访问时，会自动去public目录寻找资源
app.use(express.static(path.resolve(__dirname, "./public")));
// 导入并注册用户路由模块
const userRouter: Router = require("./routes/login");

// 将 connection 变量暴露到全局，可以在其他模块中直接使用
// // 或者使用 process 全局变量
// process.connection = connection;
(global as any).connection = yyconnection();

app.get("/index", (req: Request, res: Response) => {
  console.log(req.ip, "app.js=============>IP");
  res.json({
    code: 200,
    message: "我是as最新的appd.js",
  });
});
app.use("/api", userRouter);
app.listen(9999, () => {
  console.log("app.js入口服务启动了");
});

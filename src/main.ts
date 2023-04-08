import express from "express";
import { Router, Request, Response, NextFunction } from "express";
import yyconnection from "./tools/mysql_db";
import { expressjwt } from "express-jwt"; // 解析 token 的中间件
import path from "path";
import { userRouter } from "@/router/user";
import { userInfoRouter } from "@/router/user-info";

// 导入配置文件
const config = require("@/tools/confi-jwt");

const app = express();
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(
  expressjwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/api\//],
  })
);
// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }));
// 设置static中间件后，浏览器访问时，会自动去public目录寻找资源
app.use(express.static(path.resolve(__dirname, "./public")));

// 将 connection 变量暴露到全局，可以在其他模块中直接使用
// // 或者使用 process 全局变量
// process.connection = connection;
(global as any).connection = yyconnection();

app.get("/api/index", (req: Request, res: Response) => {
  console.log(req.ip, "app.js=============>IP");
  // res.json({
  //   code: 200,
  //   message: "我是as最新的appd.jsc测试最新的",
  // });
  res.send(`
          <html>
              <head>
                  <title>SSR</title>
              </head>
              <body>
                  <p>hello world你好啊</p>
              </body>
          </html>
        `);
});
app.use("/api", userRouter);
app.use("/permissions", userInfoRouter);
// 错误中间件
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  // token 解析失败导致的错误
  if (err.name === "UnauthorizedError") {
    return res.send({ status: 401, message: "Invalid token(无效的token)" });
  }
  // 其他原因导致的错误
  res.send({ status: 500, message: "Unknown error(未知错误)" });
});
app.listen(9999, () => {
  console.log("app.js入口服务启动了");
});

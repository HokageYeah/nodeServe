import express from "express";
import { Request, Response, NextFunction, Express } from "express";
import yyconnection from "@/tools/mysql_db";
import { expressjwt } from "express-jwt"; // 解析 token 的中间件
import path from "path";
import { userRouter } from "@/router/user";
import { userInfoRouter } from "@/router/user-info";
import bodyParser from "body-parser";
import { errorResponse } from "@/tools/handle-error";
import { publicKey } from "@/jwt-keys/private_public_path";
import { UNAUTHORIZED_ERROR } from '@/config/error'

// 导入jwt配置文件(密钥)
const config = require("@/tools/confi-jwt");
// 创建app
const app: Express = express();
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
//设置签名算法 HS256:对称加密
// RS256:非对称加密
app.use(
    expressjwt({ secret: publicKey, algorithms: ["RS256"] }).unless({
        path: [/^\/api\//],
    })
);
// 配置解析表单数据的中间件 application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // 解析 传递的JSON 数据
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
// api接口是不需要token验证的 其他接口需要
app.use("/api", userRouter);
app.use("/permissions", userInfoRouter);
// 错误中间件
app.use(function (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // token 解析失败导致的错误
    if (err.name === UNAUTHORIZED_ERROR) {
        err.code = err.name
    }
    errorResponse(res, err.code, err.message);
    // 其他原因导致的错误
    // res.send({ status: 500, message: "Unknown error(未知错误)" });
});

export default app;

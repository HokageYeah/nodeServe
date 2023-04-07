import { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
  auth?: any;
}

const getUserInfo = (req: AuthenticatedRequest, res: Response) => {
  // 在 @types/express-jwt 类型声明文件中找到 Request 接口并添加一个可选的 user 属性。
  // 你可以创建一个 custom.d.ts 文件，然后将以下内容添加到该文件中
  // 然后将 custom.d.ts 文件导入到你的应用程序中即可：
  //   const userInfo: Express.Request["user"] = req.user;
  console.log("查看解析出来的用户信息是什么=====>", req?.auth);
  res.send({
    status: 200,
    message: "获取用户信息成功！",
    // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
    data: "查看：" + req?.auth,
  });
};

export { getUserInfo };

import { Response } from "express";
import { AuthenticatedRequest } from "@/tools/confi-jwt";
import { successResponse } from "@/tools/handle-error";
import Moment_DBService from "@/service/moment_service";

class UserMomentsController {
  getUserComents = (req: AuthenticatedRequest, res: Response) => {
    // 在 @types/express-jwt 类型声明文件中找到 Request 接口并添加一个可选的 user 属性。
    // 你可以创建一个 custom.d.ts 文件，然后将以下内容添加到该文件中
    // 然后将 custom.d.ts 文件导入到你的应用程序中即可：
    //   const userInfo: Express.Request["user"] = req.user;
    console.log("查看解析出来的用户信息是什么(新的)=====>", req?.auth);
    // 1、获取动态内容
    const { content } = req.body;
    successResponse(res, { message: "获取用户动态成功" + content });
  };
  createUserComents = (req: AuthenticatedRequest, res: Response) => {
    // 在 @types/express-jwt 类型声明文件中找到 Request 接口并添加一个可选的 user 属性。
    // 你可以创建一个 custom.d.ts 文件，然后将以下内容添加到该文件中
    // 然后将 custom.d.ts 文件导入到你的应用程序中即可：
    //   const userInfo: Express.Request["user"] = req.user;
    console.log("查看解析出来的用户信息是什么(新的)=====>", req?.auth);
    // 1、获取动态内容
    const { content } = req.body;
    successResponse(res, { message: "获取用户动态成功" + content });
  };
}

export default new UserMomentsController();

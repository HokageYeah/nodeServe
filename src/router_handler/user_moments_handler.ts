import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@/tools/confi-jwt";
import { successResponse } from "@/tools/handle-error";
import Moment_DBService from "@/service/moment_service";
import {
  UNGET_USER_INFORMATION,
  CONTENT_BE_EMPTY,
  SERVER_ERROR,
  GET_USER_MOMENT_LISTS_ERROR,
  GET_USER_MOMENT_DETAILS_ERROR,
  CREATE_USER_MOMENT_ERROR,
  CREAT_LABEL_MOMENT_ERROR
} from "@/config/error";
class UserMomentsController {
  getUserComentsList = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 在 @types/express-jwt 类型声明文件中找到 Request 接口并添加一个可选的 user 属性。
    // 你可以创建一个 custom.d.ts 文件，然后将以下内容添加到该文件中
    // 然后将 custom.d.ts 文件导入到你的应用程序中即可：
    //   const userInfo: Express.Request["user"] = req.user;
    try {
      console.log("查看解析出来的用户信息是什么(新的)=====>", req?.auth);
      const tokenUserInfo = req.auth;
      if (!tokenUserInfo) {
        // token中没有数据
        await next({ code: UNGET_USER_INFORMATION });
        return;
      }
      // 1、获取分页数据
      const { page = 0, pageSize } = req.body;
      tokenUserInfo.page = page;
      tokenUserInfo.pageSize = pageSize;
      // 1、获取动态内容
      const [getUserMomentsResult] = await Moment_DBService.queryMoment(tokenUserInfo);
      const getListAry: any[] = Array.isArray(getUserMomentsResult) ? getUserMomentsResult : [getUserMomentsResult];
      if (!getListAry || getListAry.length == 0) {
        return await next({ code: GET_USER_MOMENT_LISTS_ERROR })
      }
      return successResponse(res, { message: "获取用户动态成功", getUserMomentsResult });
    } catch (error:any) {
      console.error(error);
      await next({ code: SERVER_ERROR, message: error.sql });
      return;
    }
  };
  createUserComents = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // 在 @types/express-jwt 类型声明文件中找到 Request 接口并添加一个可选的 user 属性。
      // 你可以创建一个 custom.d.ts 文件，然后将以下内容添加到该文件中
      // 然后将 custom.d.ts 文件导入到你的应用程序中即可：
      //   const userInfo: Express.Request["user"] = req.user;
      const tokenUserInfo = req.auth;
      // 1、获取动态内容
      const { content } = req.body;
      if (!tokenUserInfo) {
        // token中没有数据
        await next({ code: UNGET_USER_INFORMATION });
        return;
      } else if (!content || content.length == 0) {
        // content的值不能为空
        await next({ code: CONTENT_BE_EMPTY });
        return;
      }
      tokenUserInfo.content = content;
      // 将用户名和加密后的密码保存到数据库中
      const [createMomentsResult] = await Moment_DBService.createMoment(tokenUserInfo);
      console.log("查看插入后的评论是什么=====>", createMomentsResult);
      if (!createMomentsResult) {
        return await next({ code: CREATE_USER_MOMENT_ERROR })
      }
      return successResponse(res, { message: "创建用户动态成功", ...createMomentsResult });
    } catch (error:any) {
      console.error(error);
      await next({ code: SERVER_ERROR, message: error.sql });
      return;
    }
  };

  getUserComentsDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      console.log("查看解析出来的用户信息是什么(getUserComentsDetails)=====>", req?.auth);
      const tokenUserInfo = req.auth;
      if (!tokenUserInfo) {
        // token中没有数据
        await next({ code: UNGET_USER_INFORMATION });
        return;
      }
      // 1、获取分页数据
      const { momentid } = req.body;
      tokenUserInfo.momentid = momentid;
      // 1、获取动态内容
      const [getUserMomentsResult] = await Moment_DBService.getMomentDetails(tokenUserInfo);
      const getDetailsAry: any[] = Array.isArray(getUserMomentsResult) ? getUserMomentsResult : [getUserMomentsResult];
      console.log('查看动态详情数据返回=======>', getUserMomentsResult);
      if (!getDetailsAry || getDetailsAry.length == 0) {
        return await next({ code: GET_USER_MOMENT_DETAILS_ERROR })
      }
      return successResponse(res, getDetailsAry[0]);
    } catch (error:any) {
      console.error(error);
      await next({ code: SERVER_ERROR, message: error.sql });
      return;
    }
  };
  modifyUserComents = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const tokenUserInfo = req.auth;
      if (!tokenUserInfo) {
        // token中没有数据
        await next({ code: UNGET_USER_INFORMATION });
        return;
      }
      const { momentid, content } = req.body;
      tokenUserInfo.momentid = momentid;
      tokenUserInfo.content = content;
      const [modifyMomentResult] = await Moment_DBService.modifyMoment(tokenUserInfo)
      return successResponse(res, { message: "修改用户动态成功", ...modifyMomentResult });
    } catch (error: any) {
      await next({ code: SERVER_ERROR, message: error.sql });
      return;
    }
  };
  deleteUserComents = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const tokenUserInfo = req.auth;
      if (!tokenUserInfo) {
        // token中没有数据
        await next({ code: UNGET_USER_INFORMATION });
        return;
      }
      const { momentid } = req.body;
      tokenUserInfo.momentid = momentid;
      const [modifyMomentResult] = await Moment_DBService.deleteMoment(tokenUserInfo)
      return successResponse(res, { message: "删除用户动态成功", ...modifyMomentResult });
    } catch (error :any) {
      await next({ code: SERVER_ERROR, message: error.sql });
      return;
    }
  };
  addMomentLabels = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const tokenUserInfo = req.auth;
      if (!tokenUserInfo) {
        // token中没有数据
        await next({ code: UNGET_USER_INFORMATION });
        return;
      }
      // labels 是labelid 和name
      const { momentid, labels } = req.body;
      for (const labelObj of labels) {
        tokenUserInfo.labelid = labelObj.labelid
        tokenUserInfo.momentid = momentid
        const [result] = await Moment_DBService.hasLabelMoment(tokenUserInfo)
        console.log('查看查询标签的数组======>',labels);
        const getResultAry: any[] = Array.isArray(result) ? result : [result];
        if (getResultAry.length != 0) continue
        // 不存在进行插入操作
        const [insertResult] = await Moment_DBService.createLabelToMoment(tokenUserInfo)
        if (!insertResult) {
          return await next({ code: CREAT_LABEL_MOMENT_ERROR})
        }
      }
      return successResponse(res, { message: "动态添加标签成功" });
    } catch (error :any) {
      console.log("查看错误========>",error);
      await next({ code: SERVER_ERROR, message: error.sql });
      return;
    }
  }
}

export default new UserMomentsController();

// 接口权限管理的中间件
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/tools/confi-jwt";
import { UNGET_USER_INFORMATION, OPERATION_IS_NOT_ALLOWED, MODIFY_USER_MOMENT_ERROR } from "@/config/error";
import Permission_DBService from '@/service/permission_service'
import permission_service from "@/service/permission_service";
// 用户动态接口增删改茶权限（moment接口权限） 函数柯力化封装
export const  verifyPermission = (verifyStr: string) => {
    return  async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
      ) => {
        // 1、获取登陆用户的ID， 以及修改动态的momentid
        try {
          const tokenUserInfo = req.auth;
          if (!tokenUserInfo) {
            // token中没有数据
            await next({ code: UNGET_USER_INFORMATION });
            return;
          }
          const verify = req.body[verifyStr];
          tokenUserInfo[verifyStr] = verify
          const [queryMoment] = await permission_service.queryMoment(tokenUserInfo, verifyStr);
          const queryMomentAry: any[] = Array.isArray(queryMoment) ? queryMoment : [queryMoment];
          if (!queryMomentAry || queryMomentAry.length == 0) {
            return await next({ code: MODIFY_USER_MOMENT_ERROR })
          }
          const [verifyPermission] = await Permission_DBService.checkMomentPermission(tokenUserInfo, verifyStr);
          const verifyPermissionAry: any[] = Array.isArray(verifyPermission) ? verifyPermission : [verifyPermission];
          if (!verifyPermissionAry || verifyPermissionAry.length == 0) {
              return await next({ code: OPERATION_IS_NOT_ALLOWED })
            }
            await next();
        } catch (error) {}
      };
}
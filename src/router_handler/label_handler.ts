import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@/tools/confi-jwt";
import { successResponse } from "@/tools/handle-error";
import Label_DBService from "@/service/label_service";
import {
    UNGET_USER_INFORMATION,
    SERVER_ERROR,
    CREATE_LABEL_ERROR,
    CREATE_LABEL_REPEAT
} from "@/config/error";
class LabelController {
    createLabel = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // 在 @types/express-jwt 类型声明文件中找到 Request 接口并添加一个可选的 user 属性。
            // 你可以创建一个 custom.d.ts 文件，然后将以下内容添加到该文件中
            // 然后将 custom.d.ts 文件导入到你的应用程序中即可：
            //   const userInfo: Express.Request["user"] = req.user;
            const tokenUserInfo = req.auth;
            // 1、获取动态内容
            const { name } = req.body;
            if (!tokenUserInfo) {
                // token中没有数据
                await next({ code: UNGET_USER_INFORMATION });
                return;
            } 
            tokenUserInfo.name = name;
            // 查询标签是否存在，存在提示不允许在插入
            const [queryLabel] = await Label_DBService.queryLabelReply(tokenUserInfo);
            const queryLabelAry: any[] = Array.isArray(queryLabel) ? queryLabel : [queryLabel];
            if(queryLabelAry.length > 0) {
                return await next({ code: CREATE_LABEL_REPEAT });
            }
            const [createLabelResult] = await Label_DBService.createLabel(tokenUserInfo);
            console.log("查看插入后的标签是什么createLabelResult=====>", createLabelResult);
            if (!createLabelResult) {
                return await next({ code: CREATE_LABEL_ERROR })
            }
            return successResponse(res, { message: "创建标签成功", ...createLabelResult });
        } catch (error) {
            console.error(error);
            await next({ code: SERVER_ERROR, message: error });
            return;
        }
    };
}

export default new LabelController();

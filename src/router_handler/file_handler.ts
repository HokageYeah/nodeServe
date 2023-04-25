import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@/tools/confi-jwt";
import { successResponse } from "@/tools/handle-error";
import File_DBService from "@/service/file_service";
import {
    UNGET_USER_INFORMATION,
    SERVER_ERROR,
    CREATE_LABEL_ERROR,
    CREAT_USER_AVATAR_ERROR
} from "@/config/error";
class FilesController {
    uploadFile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // 在 @types/express-jwt 类型声明文件中找到 Request 接口并添加一个可选的 user 属性。
            // 你可以创建一个 custom.d.ts 文件，然后将以下内容添加到该文件中
            // 然后将 custom.d.ts 文件导入到你的应用程序中即可：
            //   const userInfo: Express.Request["user"] = req.user;
            const tokenUserInfo = req.auth;
            // 1、获取动态内容
            const { filename, mimetype, size } = req.file as any;
            if (!tokenUserInfo) {
                // token中没有数据
                await next({ code: UNGET_USER_INFORMATION });
                return;
            }
            tokenUserInfo.filename = filename;
            tokenUserInfo.mimetype = mimetype;
            tokenUserInfo.size = size;
            const [createFilesResult] = await File_DBService.createFile(tokenUserInfo);
            console.log("查看插入后的文件标签是什么createFilesResult=====>", createFilesResult);
            if (!createFilesResult) {
                return await next({ code: CREAT_USER_AVATAR_ERROR })
            }
            console.log('查看头像上传成功信息========>', req.file);
            return successResponse(res, { message: "上传头像成功" });
        } catch (error) {
            console.error(error);
            await next({ code: SERVER_ERROR, message: error });
            return;
        }
    };
}

export default new FilesController();
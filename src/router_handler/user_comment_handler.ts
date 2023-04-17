import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@/tools/confi-jwt";
import { successResponse } from "@/tools/handle-error";
import Comment_DBService from "@/service/comment_service";
import {
    UNGET_USER_INFORMATION,
    CONTENT_BE_EMPTY,
    SERVER_ERROR,
    CREATE_USER_COMMENT_ERROR,
    CREATE_USER_COMMENT_REPLY_ERROR
} from "@/config/error";
class UserCommentController {
    createUserComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // 在 @types/express-jwt 类型声明文件中找到 Request 接口并添加一个可选的 user 属性。
            // 你可以创建一个 custom.d.ts 文件，然后将以下内容添加到该文件中
            // 然后将 custom.d.ts 文件导入到你的应用程序中即可：
            //   const userInfo: Express.Request["user"] = req.user;
            const tokenUserInfo = req.auth;
            // 1、获取动态内容
            const { content, momentid } = req.body;
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
            tokenUserInfo.momentid = momentid;
            const [createCommentsResult] = await Comment_DBService.createComment(tokenUserInfo);
            console.log("查看插入后的评论是什么createCommentsResult=====>", createCommentsResult);
            if (!createCommentsResult) {
                return await next({ code: CREATE_USER_COMMENT_ERROR })
            }
            return successResponse(res, { message: "创建用户评论成功", ...createCommentsResult });
        } catch (error) {
            console.error(error);
            await next({ code: SERVER_ERROR, message: error });
            return;
        }
    };
    createUserCommentReply = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const tokenUserInfo = req.auth;
            // 1、获取动态内容
            const { content, momentid, replyid } = req.body;
            if (!tokenUserInfo) {
                // token中没有数据
                await next({ code: UNGET_USER_INFORMATION });
                return;
            }
            tokenUserInfo.content = content;
            tokenUserInfo.momentid = momentid;
            tokenUserInfo.replyid = replyid;
            const [createCommentsResult] = await Comment_DBService.createCommentReply(tokenUserInfo);
            console.log("查看插入后的评论是什么createCommentsResult=====>", createCommentsResult);
            if (!createCommentsResult) {
                return await next({ code: CREATE_USER_COMMENT_REPLY_ERROR })
            }
            return successResponse(res, { message: "创建用户回复成功" });
        } catch (error) {
            console.error(error);
            await next({ code: SERVER_ERROR, message: error });
            return;
        }
    }
}

export default new UserCommentController();

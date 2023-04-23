
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/tools/confi-jwt";
import Label_DBService from "@/service/label_service";
import { User } from "@/libcommon/index";
import { ResultSetHeader } from "mysql2";

export const verifyLabelExists = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 获取客户端传递过来的labels
    const { labels } = req.body
    const newLabels = []
    for (const name of labels) {
        const user: User = { username: '', password: '', name };
        const [queryLabel] = await Label_DBService.queryLabelReply(user)
        const queryLabelAry: any[] = Array.isArray(queryLabel) ? queryLabel : [queryLabel];
        type labelObjType = {
            name: string,
            labelid?: number
        }
        const labelObj: labelObjType = { name }
        if (queryLabelAry.length > 0) { //存在 获取namen对应的labelid
            labelObj.labelid = queryLabelAry[0].labelid
        } else { // 不存在 插入name， 并且获取插入后的id
            const [inserResult] = await Label_DBService.createLabel(user)
            const insertId = (inserResult as ResultSetHeader).insertId
            labelObj.labelid = insertId
        }
        newLabels.push(labelObj)
    }
    req.body.labels = newLabels
    await next()
}
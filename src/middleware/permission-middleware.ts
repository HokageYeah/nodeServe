// 接口权限管理的中间件
import { Request, Response, NextFunction } from "express";

// 用户动态接口增删改茶权限（moment接口权限）
export const verifyMomentPermission = (req: Request, res: Response, next: NextFunction) => {
    // 1、获取登陆用户的ID， 以及修改动态的momentid
}
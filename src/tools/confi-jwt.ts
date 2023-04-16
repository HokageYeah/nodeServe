import { Request } from "express";
import { User } from "@/libcommon/index";
// 设置签名算法 HS256:对称加密
export const jwtSecretKey = "HokageYeah";
export interface AuthenticatedRequest extends Request {
  auth?: User;
}

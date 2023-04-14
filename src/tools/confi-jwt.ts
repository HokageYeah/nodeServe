import { Request } from "express";
// 设置签名算法 HS256:对称加密
export const jwtSecretKey = "HokageYeah";
export interface AuthenticatedRequest extends Request {
  auth?: any;
}

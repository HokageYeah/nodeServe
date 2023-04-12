import { Response } from "express";
import { ResponseData } from "@/libcommon/index";

// 失败处理函数
export const errorResponse = (message: string, code: number, res: Response) => {
  const responseData: ResponseData = {
    code,
    message: "（失败新的）：" + message,
  };
  res.status(code).json(responseData);
};
// 成功返回
export const successResponse = (res: Response, data?: any) => {
  const responseData: ResponseData = {
    code: 200,
    message: "成功新鲜的success",
  };
  if (data) {
    responseData.data = data;
  }
  res.status(200).json(responseData);
};

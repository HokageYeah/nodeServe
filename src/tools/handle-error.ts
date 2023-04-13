import { Response } from "express";
import { ResponseData } from "@/libcommon/index";
import {
  NAME_OR_PASSWORD_IS_ERROR,
  NAME_IS_ALREADY_EXISTS,
  NAME_OR_PASSWORD_UNREGISTERED,
  PASSWORD_IS_WRONG,
  ORIGINAL_PASSWORD_IS_WRONG,
  TOKEN_DELETED,
  SERVER_ERROR
}
  from '@/config/error'

function codeMessage(codeName: string, messageName?: string) {
  let code = 0;
  let message = '（我是整理后的）';
  switch (codeName) {
    case NAME_OR_PASSWORD_IS_ERROR:
      code = -1001
      message += messageName as string
      break;
    case NAME_IS_ALREADY_EXISTS:
      code = -1002
      message += '用户已存在!'
      break;
    case NAME_OR_PASSWORD_UNREGISTERED:
      code = -1003
      message += '尚未注册该用户!'
      break;
    case PASSWORD_IS_WRONG:
      code = -1004
      message += '用户密码错误!'
      break;
    case ORIGINAL_PASSWORD_IS_WRONG:
      code = -1005
      message += '原始密码错误!'
      break;
    case TOKEN_DELETED:
      code = -1006
      message += 'token已经删除，已退出!'
      break;
    case SERVER_ERROR:
      code = -1007
      message += '服务器出错，请稍后再试!'
    default:
      break;
  }
  const responseData: ResponseData = {
    code,
    message,
  };
  return responseData
}

// 失败处理函数
export const errorResponse = (res: Response, codeName: string, messageName?: string) => {
  const responseData: ResponseData = codeMessage(codeName, messageName)
  res.status(400).json(responseData);
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

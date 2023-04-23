import { Response } from "express";
import { ResponseData } from "@/libcommon/index";
import {
  NAME_OR_PASSWORD_IS_ERROR,
  NAME_IS_ALREADY_EXISTS,
  NAME_OR_PASSWORD_UNREGISTERED,
  PASSWORD_IS_WRONG,
  ORIGINAL_PASSWORD_IS_WRONG,
  TOKEN_DELETED,
  SERVER_ERROR,
  UNAUTHORIZED_ERROR,
  UNGET_USER_INFORMATION,
  CONTENT_BE_EMPTY,
  GET_USER_MOMENT_LISTS_ERROR,
  GET_USER_MOMENT_DETAILS_ERROR,
  CREATE_USER_MOMENT_ERROR,
  OPERATION_IS_NOT_ALLOWED,
  MODIFY_USER_MOMENT_ERROR,
  CREATE_USER_COMMENT_ERROR,
  CREATE_USER_COMMENT_REPLY_ERROR,
  CREATE_USER_COMMENT_REPLY_NONE,
  CREATE_LABEL_ERROR,
  CREATE_LABEL_REPEAT,
  CREAT_LABEL_MOMENT_ERROR
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
      message += `服务器出错，请稍后再试!error:${messageName}`
      break;
    case UNAUTHORIZED_ERROR:
      code = -1008
      message += 'Invalid token(无效的token)!'
      break;
    case UNGET_USER_INFORMATION:
      code = -1009
      message += 'token中无法获取用户信息'
      break
    case CONTENT_BE_EMPTY:
      code = -1010
      message += '插入的内容content为空'
      break
    case GET_USER_MOMENT_LISTS_ERROR:
      code = -1011
      message += '该用户暂无动态'
      break
    case GET_USER_MOMENT_DETAILS_ERROR:
      code = -1012
      message += '数据库中获取用户动态详情失败'
      break
    case CREATE_USER_MOMENT_ERROR:
      code = -1013
      message += '创建用户动态失败'
      break
    case OPERATION_IS_NOT_ALLOWED:
      code = -1014
      message += '没有操作该资源的权限'
      break
    case MODIFY_USER_MOMENT_ERROR:
      code = -1015
      message += '没有此条数据，操作失败！？？'
      break
    case CREATE_USER_COMMENT_ERROR:
      code = -1016
      message += '创建用户评论失败！'
      break
    case CREATE_USER_COMMENT_REPLY_ERROR:
      code = -1017
      message += '回复用户评论失败！'
      break
    case CREATE_USER_COMMENT_REPLY_NONE:
      code = -1018
      message += '当前回复的评论不存在！'
      break
    case CREATE_LABEL_ERROR:
      code = -1019
      message += '创建标签失败！'
      break
    case CREATE_LABEL_REPEAT:
      code = -1020
      message += '标签已存在，请重新创建！'
      break
    case CREAT_LABEL_MOMENT_ERROR:
      code = -1021
      message += '动态中添加标签失败！'
      break
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

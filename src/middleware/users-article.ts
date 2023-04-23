import { body } from "express-validator";
import xss from "xss";
const validate = require("./errorBack");
const username = body("username")
  .isLength({ min: 1, max: 6 })
  .withMessage("用户名长度必须为 1-6 个字符")
  .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/)
  .withMessage("用户名只能使用数字、汉字、字母、下划线")
  .custom((value) => !/^_|_$/.test(value))
  .withMessage("用户名首位和末尾不能是下划线");
const password = body("password")
  .isLength({ min: 1, max: 10 })
  .withMessage("密码长度必须为 1-10 个字符")
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage("密码只能使用数字、字母、下划线")
  .custom((value) => !/^_|_$/.test(value))
  .withMessage("密码首位和末尾不能是下划线");
const newPassword = body("newPassword")
  .isLength({ min: 1, max: 10 })
  .withMessage("密码长度必须为 1-10 个字符")
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage("密码只能使用数字、字母、下划线")
  .custom((value) => !/^_|_$/.test(value))
  .withMessage("密码首位和末尾不能是下划线");

// 手写正则表达式
// 判断是否有  HTML 标签、 JavaScript 代码、 SQL 注入攻击，并做内容拦截。
const content = body("content")
  .isLength({ min: 1, max: 100 })
  .withMessage("内容长度最大100个字符")
  .custom((value) => !/<[^>]+>/g.test(value))
  .withMessage("输入内容格式错误！！！")
  .custom(
    (value) =>
      !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value)
  )
  .withMessage("输入内容格式错误！！！")
  .custom(
    (value) =>
      !/(?:')|(?:--)|(?:\/\*)|(?:\*\/)|(?:\b(select|union|insert|update|delete|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute)\b)/i.test(
        value
      )
  )
  .withMessage("输入内容格式错误！！！")
  // 最后兜底：使用xss插件 用于过滤 HTML 标签和 JavaScript 代码
  .customSanitizer(value => xss(value));

export const loginValidatorAry = validate([username, password]);
export const resetPasswordValidatorAry = validate([
  username,
  password,
  newPassword,
]);
export const userContentValidatorAry = validate([content]);

// 统一的文字输入教研逻辑
export const userCommentValidatorAry = function (name: string) {
  const content = body(name)
  .isLength({ min: 1, max: 100 })
  .withMessage("内容长度最大100个字符，最小为1个字符")
  .custom((value) => !/<[^>]+>/g.test(value))
  .withMessage("输入内容格式错误！！！")
  .custom(
    (value) =>
      !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value)
  )
  .withMessage("输入内容格式错误！！！")
  .custom(
    (value) =>
      !/(?:')|(?:--)|(?:\/\*)|(?:\*\/)|(?:\b(select|union|insert|update|delete|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute)\b)/i.test(
        value
      )
  )
  .withMessage("输入内容格式错误！！！")
  // 最后兜底：使用xss插件 用于过滤 HTML 标签和 JavaScript 代码
  .customSanitizer(value => xss(value));
  return validate([content])
}
// module.exports.register = validate([
//     username,
//     password
// ])

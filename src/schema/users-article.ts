import { body, validationResult } from "express-validator";
const validate = require("./errorBack");
const username = body("username")
  .isLength({ min: 1, max: 6 })
  .withMessage("用户名长度必须为 1-6 个字符")
  .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/)
  .withMessage("用户名只能使用数字、汉字、字母、下划线")
  .custom(value => !/^_|_$/.test(value))
  .withMessage("用户名首位和末尾不能是下划线")
const password = body("password")
  .isLength({ min: 1, max: 10 })
  .withMessage("密码长度必须为 1-10 个字符")
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage("密码只能使用数字、字母、下划线")
  .custom(value => !/^_|_$/.test(value))
  .withMessage("密码首位和末尾不能是下划线");

export const validatorAry = validate([username, password]);
// module.exports.register = validate([
//     username,
//     password
// ])

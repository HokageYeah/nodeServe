import { body } from "express-validator";
import xss from "xss";
const validate = require("./errorBack");

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

const momentid = body("momentid")
    .notEmpty().withMessage('momentid参数为null')
    .isNumeric().withMessage('momentid参数必须为数字')

export const userCommentParamsVerify = validate([content, momentid]);
// module.exports.register = validate([
//     username,
//     password
// ])

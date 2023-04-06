import { body, validationResult } from "express-validator";
const validate = require('./errorBack')
const username = body('username').isLength({ min: 1, max: 6 }).withMessage('用户名长度必须为 1-6 个字符')
const password = body('password').isLength({ min: 1, max: 10 }).withMessage('密码长度必须为 1-10 个字符')

// export const validatorAry = validate([
//     username,
//     password
// ])
module.exports.register = validate([
    username,
    password
])
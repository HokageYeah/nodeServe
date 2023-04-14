import { Request, Response, NextFunction } from "express";
// pm2 start npm --name nodeServe -- run start --watch (这个命令会用pm2去执行管理node，并且会运行package.json中定义的start脚本
// "start": "pm2 start src/main.ts --interpreter /Users/yuye/.nvm/versions/node/v14.21.2/bin/ts-node --watch", 这个方法无法管理@符号后面的内容。
// 这个问题可能是由于在使用 pm2 运行项目时没有正确设置 tsconfig-paths 的原因导致的。可以按照以下步骤来解决：
// 首先需要全局安装 tsconfig-paths：
// npm install -g tsconfig-paths
// 然后在 package.json 中的 start 命令中添加以下内容：
// ts-node -r tsconfig-paths/register
// 最后，使用以下命令启动应用程序：
// pm2 start npm --name my-app -- start
// 这将使用 pm2 运行 npm start 命令，其中包括 ts-node 解释器和 tsconfig-paths 注册器。这样你的 ts 项目中的路径别名就应该能够正确地解析了。
import connectionMysql from "@/tools/mysql_db";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ResultSetHeader } from "mysql2";
import User_DBService from "@/service/user_service";
import { successResponse } from "@/tools/handle-error";
import { privateKey } from "@/jwt-keys/private_public_path";
import {
  NAME_OR_PASSWORD_IS_ERROR,
  NAME_IS_ALREADY_EXISTS,
  NAME_OR_PASSWORD_UNREGISTERED,
  PASSWORD_IS_WRONG,
  ORIGINAL_PASSWORD_IS_WRONG,
  TOKEN_DELETED,
  SERVER_ERROR,
} from "@/config/error";

// 导入配置文件
import { jwtSecretKey } from "@/tools/confi-jwt";
class userController {
  // 用户登录的处理函数
  async userLogin(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    // 检查参数是否合法
    this.verificationFun(req, res, next, false, async () => {
      console.log("我是校验通过后才能执行的文字");
      try {
        // 查询数据库中是否存在该用户名
        const result = await User_DBService.queryUser({ username, password });
        const users: any[] = Array.isArray(result) ? result : [result];
        const [values, fields] = users;
        if (values.length === 0) {
          await next({ code: NAME_OR_PASSWORD_UNREGISTERED });
          return;
        }
        console.log("password查看请求参数是什么============>：", password);
        // 使用bcrypt对输入的密码进行比较
        const isMatch = await bcrypt.compare(password, values[0].password);
        console.log("查看一下数据isMatch：====>：", isMatch);
        if (!isMatch) {
          await next({ code: PASSWORD_IS_WRONG });
          return;
        }
        // 生成JWT令牌
        // 生成 Token 字符串
        // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = { ...values[0], password: "" };
        const tokenStr = jwt.sign(user, privateKey, {
          expiresIn: 60 * 10, // token 有效期为 10分钟  数字为秒s
          // algorithm: "HS256", //设置签名算法 HS256:对称加密
          algorithm: "RS256", // RS256:非对称加密
        });
        console.log("查看一下数据tokenStr：====>：", tokenStr);
        return successResponse(res, {
          ...user,
          token: "Bearer " + tokenStr,
        });
      } catch (err: any) {
        // 处理异常情况
        console.error(`登录SQL 查询失败: ${err}`);
        await next({ code: SERVER_ERROR });
        return;
      }
    });
  }

  // 用户注册处理函数
  async userRegister(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    this.verificationFun(req, res, next, false, async () => {
      try {
        // 查询数据库中是否存在该用户名
        const result = await User_DBService.queryUser({ username, password });
        const users: any[] = Array.isArray(result) ? result : [result];
        const [values, fields] = users;
        if (values.length > 0) {
          console.log("这个是存在用户的毁掉=========>");
          await next({ code: NAME_IS_ALREADY_EXISTS });
          return;
        }
        console.log("这个是下一步下一步=========>");
        // 使用bcrypt对密码进行加密
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // 将用户名和加密后的密码保存到数据库中
        const registUser = await User_DBService.createUser({
          username,
          password: hashedPassword,
        });
        console.log("查询注册后数据库返回的数据是什么=====>", registUser);
        const resultSetHeader = registUser[0] as ResultSetHeader;
        const userid = resultSetHeader.insertId;
        // user_details这个表后续不在更新，此段插入代码后续注释掉。所有用户信息都存储在users表中。
        const userDetailsInsertResult = await User_DBService.createUserDetails({
          userid,
          username,
          password: hashedPassword,
          user_avatar_pic: "图片" + userid,
          user_address: "地址" + userid,
        });
        if (registUser && userDetailsInsertResult) {
          // res.send({ code: 400, message: "注册成功！", data: resultSetHeader });
          return successResponse(res, resultSetHeader);
        }
      } catch (error: any) {
        console.error(error);
        await next({ code: SERVER_ERROR });
        return;
      }
    });
  }

  // 用户重置密码处理函数
  async useResetPassword(req: Request, res: Response, next: NextFunction) {
    const { username, password, newPassword } = req.body;
    this.verificationFun(req, res, next, true, async () => {
      try {
        // 查询数据库中是否存在该用户名
        const result = await User_DBService.queryUser({ username, password });
        const users: any[] = Array.isArray(result) ? result : [result];
        const [values, fields] = users;
        // 如果找不到用户，返回错误信息
        if (!values.length) {
          await next({ code: NAME_OR_PASSWORD_UNREGISTERED });
          return;
        }
        // 判断输入的原始密码是否正确 使用bcrypt对输入的密码进行比较
        const isPasswordCorrect = await bcrypt.compare(
          password,
          values[0].password
        );
        if (!isPasswordCorrect) {
          await next({ code: ORIGINAL_PASSWORD_IS_WRONG });
          return;
        }
        // 对新密码进行哈希加密
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 更新用户密码
        const forgotPassword = await User_DBService.modifyUser({
          username,
          password: hashedPassword,
          userid: values[0].userid,
        });
        if (forgotPassword) {
          return successResponse(res, { message: "密码重置成功" });
        }
      } catch (error: any) {
        console.error(error);
        await next({ code: SERVER_ERROR });
        return;
      }
    });
  }

  // 退出登录
  async userLogout(req: Request, res: Response, next: NextFunction) {
    // 将 token 添加到黑名单中
    // 由于 JWT 的无法撤回性，所以我们将 token 添加到黑名单中，
    // 以确保该 token 在有效期内无法再次使用。
    // 通常情况下，这个黑名单应该存在数据库中，而不是数组中。
    // 在这里我们使用一个全局变量模拟一个黑名单。
    try {
      // 从请求头中获取 token
      console.log("从请求头中获取token =====>？？？？？");
      const token = req.headers.authorization?.split(" ")[1] || req.cookies.JWT;
      console.log("从请求头中获取token =====>", token);
      if (!token) {
        await next({ code: TOKEN_DELETED });
        return;
      }
      res.clearCookie("token");
      return successResponse(res, { message: "退出登录成功", token });
    } catch (error) {
      await next({ code: SERVER_ERROR });
      return;
    }
  }

  // 校验账号、密码的公用方法。
  async verificationFun(
    req: Request,
    res: Response,
    next: NextFunction,
    isforgotPassword: boolean,
    callBack: Function
  ) {
    const { username, password, newPassword } = req.body;
    // 检查参数是否合法
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await next({ code: 400, message: errors.array() });
      return;
    }
    if (!username || !password) {
      if (isforgotPassword && !newPassword) {
        await next({
          message: "用户名、密码、新密码不能为空！",
          code: NAME_OR_PASSWORD_IS_ERROR,
        });
        return;
      } else {
        await next({
          message: "用户名和密码不能为空！",
          code: NAME_OR_PASSWORD_IS_ERROR,
        });
        return;
      }
    }
    if (username.length > 10 || password.length > 10) {
      if (isforgotPassword && !newPassword) {
        await next({
          message: "用户名、密码、新密码超过10个字符，请重新输入！",
          code: NAME_OR_PASSWORD_IS_ERROR,
        });
        return;
      } else {
        await next({
          message: "用户名和密码超过10个字符，请重新输入！",
          code: NAME_OR_PASSWORD_IS_ERROR,
        });
        return;
      }
    }
    callBack();
  }
}

export default new userController();
// module.exports = new userController();

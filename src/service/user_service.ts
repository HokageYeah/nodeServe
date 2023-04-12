import { User } from "@/libcommon/index";
import connectionMysql from "@/tools/mysql_db";

class User_DBService {
  // 查询用户
  async queryUser(user: User) {
    const connect = await connectionMysql();
    // 获取用户信息
    const { username, password } = user;
    // 拼接sql语句
    const sql = `SELECT * FROM users WHERE username = ?`;
    // 执行sql语句
    const result = await connect.execute(sql, [username]);
    // 释放连接
    connect.release();
    return result;
  }

  // 创建用户
  async createUser(user: User) {
    const connect = await connectionMysql();
    // 获取用户信息
    const { username, password } = user;
    // 拼接sql语句
    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    // 将用户名和加密后的密码保存到数据库中
    const registUser = await connect.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );
    connect.release();
    return registUser;
  }

  // 修改用户密码
  async modifyUser(user: User) {
    const connect = await connectionMysql();
    // 获取用户信息
    const { password, userid } = user;
    // 更新用户密码
    const newSql = `UPDATE users SET password = ? WHERE userid = ?`;
    const forgotPassword = await connect.execute(newSql, [password, userid]);
    connect.release();
    return forgotPassword;
  }

  // 往用户详情里面添加数据
  async createUserDetails(user: User) {
    const connect = await connectionMysql();
    // 获取用户信息
    const { password, userid, username, user_avatar_pic, user_address } = user;
    // 更新用户详情信息
    const newSql = `INSERT INTO user_details (userid, username, password, user_avatar_pic, user_address) VALUES (?, ?, ?, ?, ?)`;
    const userDetailsInsertResult = await connect.execute({
      sql: newSql,
      values: [userid, username, password, user_avatar_pic, user_address],
    });
    // 释放连接
    connect.release();
    return userDetailsInsertResult;
  }
}
export default new User_DBService();

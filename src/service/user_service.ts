import { User } from "@/libcommon/index";
import connectionMysql from "@/tools/mysql_db";
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";

interface User_DBServiceCls<T> {
    queryUser(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    createUser(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    modifyUser(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>
    createUserDetails(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>
}
// 定义查询结果数据类型
type QueryResult<T> = [T[], RowDataPacket[]];

class User_DBService<T> implements User_DBServiceCls<T>{
    // 查询用户
    async queryUser(user: T) {
        const connect = await connectionMysql();
        // 获取用户信息
        const { username, password } = user as User;
        // 拼接sql语句
        const sql = `SELECT * FROM users WHERE username = ?`;
        // 执行sql语句
        const result = await connect.execute<ResultSetHeader>(sql, [username]);
        // 释放连接
        connect.release();
        return result;
    }

    // 创建用户
    async createUser(user: T) {
        const connect = await connectionMysql();
        // 获取用户信息
        const { username, password } = user as User;
        // 拼接sql语句
        const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
        // 将用户名和加密后的密码保存到数据库中
        const registUser = await connect.execute<ResultSetHeader>(sql,[username, password]);
        connect.release();
        return registUser;
    }

    // 修改用户密码
    async modifyUser(user: T) {
        const connect = await connectionMysql();
        // 获取用户信息
        const { password, userid } = user as User;
        // 更新用户密码
        const newSql = `UPDATE users SET password = ? WHERE userid = ?`;
        const forgotPassword = await connect.execute<ResultSetHeader>(newSql, [password, userid]);
        connect.release();
        return forgotPassword;
    }

    // 往用户详情里面添加数据
    async createUserDetails(user: T) {
        const connect = await connectionMysql();
        // 获取用户信息
        const { password, userid, username, user_avatar_pic, user_address } = user as User;
        // 更新用户详情信息
        const newSql = `INSERT INTO user_details (userid, username, password, user_avatar_pic, user_address) VALUES (?, ?, ?, ?, ?)`;
        const userDetailsInsertResult = await connect.execute<ResultSetHeader>({
            sql: newSql,
            values: [userid, username, password, user_avatar_pic, user_address],
        });
        // 释放连接
        connect.release();
        return userDetailsInsertResult;
    }
}
export default new User_DBService<User>();

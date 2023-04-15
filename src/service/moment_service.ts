

import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import connectionMysql from "@/tools/mysql_db";
import { User } from "@/libcommon/index";
interface Moment_DBServiceCls<T> {
    queryMoment(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    createMoment(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    modifyMoment(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>
}
class Moment_DBService<T> implements Moment_DBServiceCls<T>{
    // 查询动态
    async queryMoment(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { userid } = user as User;
        // 拼接sql语句
        const sql = `SELECT * FROM user_moment WHERE user_id = ?`;
        // 执行sql语句
        const momentResult = await connect.execute<ResultSetHeader>(sql, [userid]);
        // 释放连接
        connect.release();
        return momentResult;
    }
    async createMoment(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { content } = user as User;
        // 拼接sql语句
        const sql = `INSERT INTO users (content) VALUES (?)`;
        // 将用户名和加密后的密码保存到数据库中
        const createMoment = await connect.execute<ResultSetHeader>(sql,[content]);
        connect.release();
        return createMoment;
    }
    modifyMoment(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        throw new Error("Method not implemented.");
    }
}

export default new Moment_DBService<User>()
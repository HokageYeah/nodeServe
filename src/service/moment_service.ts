

import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import connectionMysql from "@/tools/mysql_db";
import { User } from "@/libcommon/index";
interface Moment_DBServiceCls<T> {
    queryMoment(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    createMoment(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    getMomentDetails(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>
    modifyMoment(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>
}
class Moment_DBService<T> implements Moment_DBServiceCls<T>{
    sqlJoin;
    constructor() {
        this.sqlJoin = `
        SELECT 
        um.momentid,um.content,um.createTime,um.updateTime,
        JSON_OBJECT('userid',u.userid,'username',u.username,'status',
        u.status,'createTime',u.createTime,'updateTime',u.updateTime) user
        FROM user_moment um
        LEFT JOIN users u ON u.userid = um.user_id`
    }
    // 查询动态列表
    async queryMoment(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { userid, page, pageSize } = user as User;
        // 设置支持分页查询
        let sql;
        let momentResult
        if (page == 0) {
            sql = `SELECT * FROM user_moment WHERE user_id = ?`;
            momentResult = await connect.execute<ResultSetHeader>(sql, [userid])
        } else {
            // 设置支持分页查询
            // 拼接分页查询sql语句
            // sql = `SELECT * FROM user_moment WHERE user_id = ? LIMIT ? OFFSET ?`;
            // 优化多表查询，将user用户信息拼接到查询的动态表中
            sql =
                `
            ${this.sqlJoin}
            WHERE user_id = ?
            LIMIT ? OFFSET ?
            `
            // 执行sql语句
            momentResult = await connect.execute<ResultSetHeader>(sql, [userid, pageSize, page]);
        }
        // 释放连接
        connect.release();
        return momentResult;
    }
    async createMoment(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { content, userid } = user as User;
        // 拼接sql语句
        const sql = `INSERT INTO user_moment (content, user_id) VALUES (?,?)`;
        // 将用户名和加密后的密码保存到数据库中
        const createMoment = await connect.execute<ResultSetHeader>(sql, [content, userid]);
        connect.release();
        return createMoment;
    }
    // 获取动态详情
    async getMomentDetails(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { momentid } = user as User;
        // 拼接sql语句
        const sql =
            `
        ${this.sqlJoin}
        WHERE um.momentid = ?
        `;
        // 将用户名和加密后的密码保存到数据库中
        const createMoment = await connect.execute<ResultSetHeader>(sql, [momentid]);
        connect.release();
        return createMoment;
    }
    modifyMoment(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        throw new Error("Method not implemented.");
    }
}

export default new Moment_DBService<User>()
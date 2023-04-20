

import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import connectionMysql from "@/tools/mysql_db";
import { User } from "@/libcommon/index";
interface Moment_DBServiceCls<T> {
    queryMoment(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    createMoment(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    getMomentDetails(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>
    modifyMoment(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>
    deleteMoment(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>
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
        let sql =
            `
        ${this.sqlJoin}
        WHERE um.momentid = ?
        `;
        // 新增获取评论的sql语句
        sql = 
        `
        SELECT
        m.momentid,m.content,m.createTime,m.updateTime,
        JSON_OBJECT('userid',u.userid,'username',u.username,'createTime',u.createTime,'updateTime',u.updateTime) user,
        (SELECT COUNT(*) FROM user_comment com WHERE com.momentid = m.momentid) commentCount,
        (
            JSON_ARRAYAGG(JSON_OBJECT('commentid',c.commentid,'content',c.content,'momentid',c.momentid))
        )comments
        FROM user_moment m
        LEFT JOIN users u ON u.userid = m.user_id
        LEFT JOIN user_comment c ON c.momentid = m.momentid
        WHERE m.momentid=?
        GROUP BY m.momentid
        `
        const createMoment = await connect.execute<ResultSetHeader>(sql, [momentid]);
        connect.release();
        return createMoment;
    }
    // 修改动态数据
    async modifyMoment(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { momentid, content } = user as User;
        // 拼接sql语句
        const sql =
            `
        UPDATE user_moment set content = ?
        WHERE momentid = ?
        `;
        const createMoment = await connect.execute<ResultSetHeader>(sql, [content, momentid]);
        connect.release();
        return createMoment;
    }
    // 删除动态数据
    async deleteMoment(user: T): Promise<[ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { momentid } = user as User;
        // 拼接sql语句
        const sql =`DELETE FROM user_moment WHERE momentid = ?`;
        const createMoment = await connect.execute<ResultSetHeader>(sql, [momentid]);
        connect.release();
        return createMoment;
    }
}

export default new Moment_DBService<User>()
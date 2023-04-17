

import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import connectionMysql from "@/tools/mysql_db";
import { User } from "@/libcommon/index";
interface Moment_DBServiceCls<T> {
    createComment(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    createCommentReply(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
}
class Comment_DBService<T> implements Moment_DBServiceCls<T>{
    async createComment(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { content, userid, momentid } = user as User;
        // 拼接sql语句
        const sql = `INSERT INTO user_comment (content, userid, momentid) VALUES (?,?,?)`;
        const createMoment = await connect.execute<ResultSetHeader>(sql, [content, userid, momentid]);
        connect.release();
        return createMoment;
    }

    async createCommentReply(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { content, userid, momentid, replyid } = user as User;
        // 拼接sql语句
        const sql = `INSERT INTO user_comment (content, userid, momentid, replyid) VALUES (?,?,?,?)`;
        const createMoment = await connect.execute<ResultSetHeader>(sql, [content, userid, momentid, replyid]);
        connect.release();
        return createMoment;
    }
}

export default new Comment_DBService<User>()
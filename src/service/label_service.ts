

import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import connectionMysql from "@/tools/mysql_db";
import { User } from "@/libcommon/index";
interface Moment_DBServiceCls<T> {
    createLabel(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    queryLabelReply(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
}
class Label_DBService<T> implements Moment_DBServiceCls<T>{
    async queryLabelReply(user: T): Promise<[ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { name } = user as User;
        // 拼接sql语句
        const sql = `SELECT * FROM user_label WHERE name = ?`;
        const createMoment = await connect.execute<ResultSetHeader>(sql, [name]);
        connect.release();
        return createMoment;
    }
    async createLabel(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { name } = user as User;
        // 拼接sql语句
        const sql = `INSERT INTO user_label (name) VALUES (?)`;
        const createMoment = await connect.execute<ResultSetHeader>(sql, [name]);
        connect.release();
        return createMoment;
    }
}

export default new Label_DBService<User>()
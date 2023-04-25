

import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import connectionMysql from "@/tools/mysql_db";
import { User } from "@/libcommon/index";
interface File_DBServiceCls<T> {
    createFile(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    queryFile(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
}
class File_DBService<T> implements File_DBServiceCls<T>{
    async queryFile(user: T): Promise<[ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { name } = user as User;
        // 拼接sql语句
        const sql = `SELECT * FROM user_label WHERE name = ?`;
        const createMoment = await connect.execute<ResultSetHeader>(sql, [name]);
        connect.release();
        return createMoment;
    }
    async createFile(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { filename, mimetype, size, userid } = user as User;
        // 拼接sql语句
        const sql = `INSERT INTO user_avatar (filename,mimetype,size,userid) VALUES (?,?,?,?)`;
        const createMoment = await connect.execute<ResultSetHeader>(sql, [filename, mimetype, size, userid]);
        connect.release();
        return createMoment;
    }
}

export default new File_DBService<User>()
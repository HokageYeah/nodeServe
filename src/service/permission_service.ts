
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import connectionMysql from "@/tools/mysql_db";
import { User } from "@/libcommon/index";
interface Permission_DBServiceCls<T extends User> {
    // 查询数据是否存在
    queryMoment(user: T, verifyPermiss: string): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    // 验证动态接口的删改当前用户是否有权限（只能修改自己的动态）
    checkMomentPermission(user: T, verifyPermiss: string): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
}
class Permission_DBService<T extends User> implements Permission_DBServiceCls<T>{
    async queryMoment(user: T, verifyPermiss: string): Promise<[ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const verifyPermissStr = user[verifyPermiss];
        const table = 'user_' + verifyPermiss.replace('id','');
        // 拼接sql语句
        const sql = `SELECT * FROM ${table} WHERE ${verifyPermiss} = ?`;
        const createMoment = await connect.execute<ResultSetHeader>(sql, [verifyPermissStr]);
        connect.release();
        return createMoment;
    }
    async checkMomentPermission(user: T, verifyPermiss: string): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { userid } = user as User;
        const verifyPermissStr = user[verifyPermiss];
        const table = 'user_' + verifyPermiss.replace('id','');
        // 拼接sql语句
        const sql = `SELECT * FROM ${table} WHERE user_id = ? AND ${verifyPermiss} = ?`;
        const createMoment = await connect.execute<ResultSetHeader>(sql, [userid, verifyPermissStr]);
        connect.release();
        return createMoment;
    }
}

export default new Permission_DBService<User>()
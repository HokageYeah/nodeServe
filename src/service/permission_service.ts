
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import connectionMysql from "@/tools/mysql_db";
import { User } from "@/libcommon/index";
interface Permission_DBServiceCls<T extends User> {
    // 查询数据是否存在
    queryMoment(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
    // 验证动态接口的删改当前用户是否有权限（只能修改自己的动态）
    checkMomentPermission(user: T, verifyPermiss: string): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
}
class Permission_DBService<T extends User> implements Permission_DBServiceCls<T>{
    async queryMoment(user: T): Promise<[ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const verifyPermissAry = user['verifyStr'];
        // 要求传递的数组，第一个必须是表的主键，切主键中包含标名称：表名命名规则user_主键名(去掉id)
        const verifyPermiss = verifyPermissAry[0]
        const table = 'user_' + verifyPermiss.replace('id','');
        let sqlStr = `SELECT * FROM ${table} WHERE `
        let sqlAry: any[] = [];
        verifyPermissAry.forEach((element: string) => {
            sqlStr += `${element} = ?`
            sqlAry.push(user[element]);
        });
        // 拼接sql语句
        // const sql = `SELECT * FROM ${table} WHERE ${verifyPermiss} = ?`;
        console.log("tokenUserInfo===========>",sqlStr, sqlAry);
        const createMoment = await connect.execute<ResultSetHeader>(sqlStr, sqlAry);
        connect.release();
        return createMoment;
    }
    async checkMomentPermission(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        const connect = await connectionMysql();
        // 获取用户信息
        const { userid } = user as User;
        // 获取用户信息
        const verifyPermissAry = user['verifyStr'];
        const verifyPermiss = verifyPermissAry[0]
        const table = 'user_' + verifyPermiss.replace('id','');
        let sqlStr = `SELECT * FROM ${table} WHERE user_id = ?`
        let sqlAry: any[] = [];
        verifyPermissAry.forEach((element: string) => {
            sqlStr += `AND ${element} = ?`
            sqlAry.push(user[element]);
        });
        // 拼接sql语句
        const sql = `SELECT * FROM ${table} WHERE user_id = ? AND ${verifyPermiss} = ?`;
        const createMoment = await connect.execute<ResultSetHeader>(sql, [userid, ...sqlAry]);
        connect.release();
        return createMoment;
    }
}

export default new Permission_DBService<User>()
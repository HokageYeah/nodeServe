
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import connectionMysql from "@/tools/mysql_db";
import { User } from "@/libcommon/index";
interface Permission_DBServiceCls<T> {
    // 验证动态接口的删改当前用户是否有权限（只能修改自己的动态）
    checkMomentPermission(user: T): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]>;
}
class permissionService<T> implements Permission_DBServiceCls<T>{
    checkMomentPermission(user: T): Promise<[OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[], FieldPacket[]]> {
        throw new Error("Method not implemented.");
    }
}

export default new permissionService<User>()
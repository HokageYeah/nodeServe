import mysql from "mysql2/promise";
export default  async function connectionMysql() {
    let yyconnection;
    yyconnection = await mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "aa123456",
        database: "my_nodeserve_db",
      });
      // 测试连接
      try {
        yyconnection.query("SELECT 1 + 1");
        console.log("Database connected successfully!");
      } catch (error) {
        console.error("Error connecting to database: ", error);
      }
      return yyconnection
};
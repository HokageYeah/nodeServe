import mysql from "mysql2/promise";
export default async function connectionMysql() {
  // let yyconnection;
  // 创建普通的数据库连接
  // yyconnection = await mysql.createConnection({
  //   host: "127.0.0.1",
  //   user: "root",
  //   port: 3306,
  //   password: "aa123456",
  //   database: "my_nodeserve_db",
  // });

  // 创建数据库连接池 性能更高一点
   const connectPool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    port: 3306,
    password: "aa123456",
    database: "my_nodeserve_db",
    connectionLimit: 5,
  });
  // 连接池用法
  const yyconnection = await connectPool.getConnection();
  // 测试连接
  try {
    yyconnection.query("SELECT 1 + 1");
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to database: ", error);
  }
  return yyconnection
};
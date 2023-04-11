import dotenv from "dotenv"
// 读取环境变量.env文件的数据 要使用 dotenv库。调用dotenv.config()后会在注入到process.env中
dotenv.config();
const port = process.env.SERVER_PORT;
console.log('查看.env文件======>', process.env.SERVER_PORT);
export const { SERVER_PORT } = process.env
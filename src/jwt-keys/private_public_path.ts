import path from "path";
import fs from "fs";
// 打开终端，输入以下命令来生成私钥：
// openssl genrsa -out private_key.pem 2048
// 输入以下命令来生成公钥：
// openssl rsa -pubout -in private_key.pem -out public_key.pem

// __dirnamed当前文件的地址，resolve会根据相对路径去拼接。 join方法是直接拼接。
export const publicKeyPath = path.resolve(__dirname, "./public_key.pem");
export const privateKeyPath = path.resolve(__dirname, "./private_key.pem");
// 同步读取私钥和公钥
export const privateKey = fs.readFileSync(privateKeyPath, "utf-8");
export const publicKey = fs.readFileSync(publicKeyPath, "utf-8");

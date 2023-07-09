import app from "@/app/index";
import { SERVER_PORT } from "@/config/server";
import WebSocketServer from '@/app/WebSocket'
import WebSocketRoomServer from '@/app/web-socket-room'

// 创建 HTTP 服务器并将 Express 应用程序挂载到它上面
const server = app.listen(SERVER_PORT, (err?: Error) => {
  if (err) {
    console.error("服务器启动失败:", err);
    return;
  }
  console.log("app.js入口服务启动了");
});
// 创建 WebSocket 服务
const wsServer = new WebSocketServer(server);
// const wsServer2 = new WebSocketRoomServer(server);

// // 创建 WebSocket 服务器并将其连接到 HTTP 服务器上
// const wsServer = new WebSocket.Server({ server });

// // 监听 WebSocket 连接事件
// wsServer.on("connection", function (socket: WebSocket) {
//   console.log("WebSocket 已经连接上了=====>", socket);
//   // 向客户端发送消息
//   socket.send("<h1>你好客户端，我是服务器的消息</h1>");
//   // 监听客户端发来的消息
//   socket.on("message", (message: string) => {
//     console.log(`WebSocket 客户端发送过来的消息: ${message}`);
//   });
//   // 监听 WebSocket 连接关闭事件
//   socket.on("close", () => {
//     console.log("WebSocket 连接关闭了");
//   });
// });

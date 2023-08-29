// webscoket中间件 启动连接
import WebSocket from "ws";
import { Server as ServerHttp } from "http";
import { Server as ServerWs } from "ws";

class WebSocketServer {
  // 保存所有连接的客户端
  clients: WebSocket[];
  private wsServer: ServerWs;
  constructor(server: ServerHttp) {
    // 创建 WebSocket 服务器并将其连接到 HTTP 服务器上
    this.wsServer = new WebSocket.Server({ server });
    this.clients = [];
    const that = this;

    // 监听 WebSocket 连接事件
    this.wsServer.on("connection", function (socket: WebSocket) {
      // 将客户端添加到clients中
      that.clients.push(socket);
      // 向客户端发送消息
      let socketObj = {
        msg: "<h1>你好客户端，我是服务器的哈哈哈哈消息</h1>",
        method: "webSocket_device_transport",
        sn: "webSocketCallBack",
      };
      socket.send(JSON.stringify(socketObj));
      // 监听客户端发来的消息
      socket.on("message", (message: any) => {
        console.log(`WebSocket 客户端发送过来的消息: ${message}`);
        const msgJson = JSON.parse(message);
        console.log(message);
        console.log(msgJson);
        this.clients.forEach((client) => {
          // 判断是否处于连接上的
          if (client.readyState === WebSocket.OPEN) {
            // client.send(message);
            console.log("WebSocket发送消息了====>");
            client.send("" + message);
            // 打字机效果服务端粗鲁实现
            if (msgJson.sn == "webSocketCallBackYeah") {
              const msg = "悲索之人烈焰加身，堕落者 不可饶恕，我既是引路的灯塔 也是净化的清泉。永恒燃烧的羽翼，带我脱离凡间的沉沦！圣火将你洗涤 今由烈火审判，于光明中得救。利刃在手 制裁八方！";
              let socketObj = {
                msg: "",
                method: "webSocket_device_transport",
                sn: "webSocketCallBackTypeWriter",
              };
              let index = 0;
              let timer = setInterval(() => {
                if (index < msg.length) {
                  socketObj.msg = msg.charAt(index);
                  client.send(JSON.stringify(socketObj));
                  index++;
                  console.log("WebSocket反馈消息了====>");
                } else {
                  clearInterval(timer);
                  return
                }
              }, 100);
            }
          }
        });
      });
      // 监听 WebSocket 连接关闭事件
      socket.on("close", () => {
        console.log("WebSocket 连接关闭了");
      });
    });

    // 定时向所有客户端发送消息
    // setInterval(() => {
    //   const data = new Date().toString();
    //   console.log("发送消息：", data);

    //   // 遍历所有客户端并发送消息
    //   this.clients.forEach((client) => {
    //     // 判断是否处于连接上的
    //     if (client.readyState === WebSocket.OPEN) {
    //       client.send(data);
    //     }
    //   });
    // }, 10000);
  }
}

export default WebSocketServer;

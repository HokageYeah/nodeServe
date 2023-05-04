// webscoket中间件 启动连接
import WebSocket, { Server as ServerWs } from "ws";
import { Server as ServerHttp } from "http";
import { Buffer } from "buffer";
import { log } from "console";

interface messageType {
  type: string;
  roomId: number;
  userId: number;
  message?: string;
}

class WebSocketRoomServer {
  private wsServer: ServerWs;
  // 保存所有连接的客户端
  clients: any = {};
  constructor(server: ServerHttp) {
    this.wsServer = new WebSocket.Server({ server });
    this.connection();
  }
  connection() {
    this.wsServer.on("connection", (socket: WebSocket) => {
      let roomidnew: number = 0;
      let useridnew: number = 0;
      console.log('服务端重新连接了------？？？？');
      if (roomidnew != 0 && useridnew != 0) {
        console.log('服务端重新连接了------');
        // this.clients[roomidnew][useridnew] = socket;
      }
      // 监听客户端发来的消息
      socket.on("message", (message: Buffer) => {
        const data = message.toString("utf8");
        const messageObj: messageType = JSON.parse(data);
        console.log("判读消息是什么：====>", messageObj);
        // 判断消息是否是加入房间的
        if (messageObj.type == "join") {
          const { roomId, userId } = messageObj;
          if (!this.clients[roomId]) {
            this.clients[roomId] = {};
          }
          roomidnew = roomId;
          useridnew = userId;
          this.clients[roomId][userId] = socket;
          console.log(`用户 ${userId} 加入 房间 ${roomId}`);
          console.log("查看是不是连接的东西=======>", this.clients);
        } else if (messageObj.type == "message") {
          // 发送消息
          const { roomId, userId, message } = messageObj;
          roomidnew = roomId;
          useridnew = userId;
          const roomClients = this.clients[roomId];
          if (!roomClients) {
            console.log("房间不存在=====>", roomId, userId, message);
            console.log("房间不存在=====>", this.clients);
            return;
          }
          Object.values(roomClients).forEach((item: unknown) => {
            const client = item as WebSocket;
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "message",
                  from: userId,
                  message,
                })
              );
            }
          });
          console.log(`用户 ${userId} 发送一条消息在房间 ${roomId}`);
        }
      });

      // 离开房间
      socket.on("close", () => {
        // 遍历所有房间，将该用户从所有房间中移除的
        delete this.clients[roomidnew][useridnew];
        // 如果房间里面没有人了就删除房间
        if (Object.keys(this.clients[roomidnew]).length === 0) {
          delete this.clients[roomidnew];
        }
        console.log("服务端关闭了=====>", roomidnew, useridnew);
        console.log("服务端关闭了=====>", this.clients);
      });
    });
  }
}

export default WebSocketRoomServer;

// webscoket中间件 启动连接
import WebSocket from "ws";
import { Server as ServerHttp } from "http";
import { Server as ServerWs } from "ws";
import { IncomingMessage } from "http";

// 定义 verifyClient 的 info 参数类型
interface VerifyClientInfo {
  origin: string;
  req: IncomingMessage;
  secure: boolean;
}

class WebSocketServer {
  // 保存所有连接的客户端
  clients: WebSocket[];
  private wsServer: ServerWs;
  constructor(server: ServerHttp) {
    // 创建 WebSocket 服务器并将其连接到 HTTP 服务器上
    this.wsServer = new WebSocket.Server({ 
      server,
      // 允许服务器解析请求头
      verifyClient: (info: VerifyClientInfo) => {
        // 这里可以进行验证逻辑，比如检查 cookie 是否有效
        // 返回 true 允许连接，返回 false 拒绝连接
        // console.log("客户端连接，info信息:", info);
        console.log('WebSocket握手请求 - info',info.req.headers.cookie);
        return true;
      },
      // path: '/ws' // WebSocket路径
    });
  
    this.clients = [];
    const that = this;

    // 监听 WebSocket 连接事件
    this.wsServer.on("connection", function (socket: WebSocket, request: IncomingMessage) {
      // 获取 cookie
      const cookies = request.headers.cookie;
      console.log("客户端连接，Cookie信息:", cookies);
      // console.log("客户端连接，request信息:", request);
      
      // 解析 cookie (简单实现)
      const parsedCookies: Record<string, string> = {};
      if (cookies) {
        cookies.split(';').forEach(cookie => {
          const parts = cookie.split('=');
          const key = parts[0].trim();
          const value = parts[1] ? parts[1].trim() : '';
          parsedCookies[key] = value;
        });
        console.log("解析后的 Cookie:", parsedCookies);
        
        // 可以将 cookie 信息保存到 socket 对象中，以便后续使用
        (socket as any).userCookies = parsedCookies;
      }
      
      // 将客户端添加到clients中
      that.clients.push(socket);
      
      // 向客户端发送消息
      let socketObj = {
        msg: "<h1>你好客户端，我是服务器的哈哈哈哈消息</h1>",
        method: "webSocket_device_transport",
        sn: "webSocketCallBack",
        user: "teacher",
      };
      
      // 将对象转换为JSON字符串，再转换为Buffer发送
      socket.send(Buffer.from(JSON.stringify(socketObj)));
      
      // 监听客户端发来的消息
      socket.on("message", (message: any) => {
        console.log(`WebSocket 客户端发送过来的消息: ${message}`);
        
        // 添加 try-catch 来处理非 JSON 格式的消息
        let msgJson: any;
        try {
          // 尝试解析为 JSON
          msgJson = JSON.parse(message);
          console.log("解析后的 JSON 消息:", msgJson);
        } catch (error) {
          // 如果解析失败，则将消息作为普通文本处理
          console.log("消息不是 JSON 格式，作为普通文本处理");
          msgJson = { 
            type: "text", 
            content: message.toString(),
            timestamp: new Date().toISOString()
          };
        }
        
        this.clients.forEach((client) => {
          // 判断是否处于连接上的
          if (client.readyState === WebSocket.OPEN) {
            // client.send(message);
            console.log("WebSocket发送消息了====>");
            // client.send("" + message);
            // 打字机效果服务端粗鲁实现
            // if (msgJson.sn == "webSocketCallBackYeah") {
              // const msg = "悲索之人烈焰加身，堕落者 不可饶恕，我既是引路的灯塔 也是净化的清泉。永恒燃烧的羽翼，带我脱离凡间的沉沦！圣火将你洗涤 今由烈火审判，于光明中得救。利刃在手 制裁八方！";
              // let socketObj = {
              //   msg: "",
              //   method: "webSocket_device_transport",
              //   sn: "webSocketCallBackTypeWriter",
              // };
              const msg =[
                {
                  msg: "好的，以下是一份：",
                  is_end: false,
                },
                {
                  msg: "关于二次函数开口方向的教学教案，供您参考理解二次函数开口方向的概念及性质",
                  is_end: false,
                },
                {
                  msg: "\n2. 掌握判断二次函数开口方向的方法。",
                  is_end: false,
                },
                {
                  msg: "\n3. 能够正确画出二次函数的图像。",
                  is_end: false,
                },
                {
                  msg: "\n\n教学内容：\n\n1.二次函数 ",
                  is_end: false,
                },
                {
                  msg: "开口方向的定次函数开口方向的方法；",
                  is_end: false,
                },
                {
                  msg: "\n\n3. 二次函数图像的绘制。",
                  is_end: false,
                },
                {
                  msg: "利刃在手 制裁八方！",
                  is_end: true,
                },
              ]
              // let socketObj = {
              //   content: "",
              //   is_end: false,
              // };
              let index = 0;
              let timer = setInterval(() => {
                if (index < msg.length) {
                  // socketObj.content = msg.charAt(index);
                  const socketObj: any = msg[index];
                  socketObj.user = "teacher";
                  
                  // 如果有保存的 cookie 信息，可以在这里使用
                  if ((client as any).userCookies) {
                    console.log("使用客户端的 Cookie 信息:", (client as any).userCookies);
                    // 可以根据 cookie 信息做一些处理，比如获取用户身份等
                  }
                  
                  // 将对象转换为JSON字符串，再转换为Buffer发送
                  client.send(Buffer.from(JSON.stringify(socketObj)));
                  index++;
                  console.log("WebSocket反馈消息了====>");
                } else {
                  clearInterval(timer);
                  return
                }
              }, 100);
            // }
          }
        });
      });
      
      // 监听 WebSocket 连接关闭事件
      socket.on("close", () => {
        console.log("WebSocket 连接关闭了");
        // 从clients数组中移除断开连接的客户端
        const index = that.clients.indexOf(socket);
        if (index !== -1) {
          that.clients.splice(index, 1);
        }
      });
      
      // 监听错误事件
      socket.on("error", (error) => {
        console.error("WebSocket 连接发生错误:", error);
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

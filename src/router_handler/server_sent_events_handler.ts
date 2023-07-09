import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "@/tools/confi-jwt";
import { successResponse } from "@/tools/handle-error";
import { EventEmitter } from "events";

class ServerSentEventsController {
  eventEmitter: EventEmitter;
  intervalId: NodeJS.Timer | undefined;
  constructor() {
    // EventEmitter,发布/订阅模式
    this.eventEmitter = new EventEmitter();
  }
  getStream = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    res.set({
      "Cache-Control": "no-cache",
      "Content-Type": "text/event-stream", // SSE设置的核心代码，设置对应的请求头信息
      Connection: "keep-alive",
      //   'Access-Control-Allow-Origin': '*', //解决跨域问题
    });

    this.eventEmitter.on("data", (data) => {
      console.log('传输过来的数据====>', data);
      // 浏览器默认的是，如果服务器端三秒内没有发送任何信息，则开始重连。服务器端可以用retry头信息，指定通信的最大间隔时间。
      res.write("retry: 10000\n");
      // event头信息表示自定义的数据类型，或者说数据的名字。
      res.write("event: connecttime\n");
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    });

    req.on("close", () => {
      clearInterval(this.intervalId);
      this.eventEmitter.off("data", (...args: any[]) => {
        console.log("查看实时数据的参数=======>", args);
      });
      res.end();
    });
    // return successResponse(res, { message: "实时数据来了" });
  };
  postStreamData = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log('查看postStreamData数据======>', req.body);
    // 实现一个每隔一秒 发送当前时间的接口
    this.intervalId = setInterval(() => {
      this.eventEmitter.emit("data", new Date().toLocaleString());
    }, 1000);
    return successResponse(res, { message: "SSE连接成功" });
  };
}

export default new ServerSentEventsController();

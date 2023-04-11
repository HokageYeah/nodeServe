
import app from '@/app/index'
import { SERVER_PORT } from "@/config/server"

app.listen(SERVER_PORT, () => {
  console.log("app.js入口服务启动了");
});

import { Express } from "express";
import fs from "fs";
import path from "path";

// 动态导入路由文件
export default async function registerRouters(app: Express) {
  // 根据fs获取所有的路由文件
  const routerAry = fs.readdirSync(__dirname);
  const routerFiles = routerAry.filter((item) => {
    // 以router.ts结尾
    return item.endsWith("router.ts");
  });
  // 动态加载路由
  routerFiles.forEach(async (element) => {
    const routerPath = path.resolve(__dirname, `./${element}`);
    // 使用es6这种方式导出 有问题：错误级别的中间件无法调用到， postman报错<pre>[object Object]</pre>
    // const routes = await import(routerPath);
    // const routesDefault = routes.default;
    const routesDefault = require(routerPath);
    app.use(routesDefault);
  });
}

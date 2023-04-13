
import { Express } from "express";
// 动态导入路由文件
export default async function registerRouters(app: Express) {
    const routes = await import('@/router/user-info-router')
    console.log('动态导入路由文件==========>', routes);
}
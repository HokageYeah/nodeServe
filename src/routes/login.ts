import express from "express";
import { Router, Request, Response } from 'express';

// 创建路由对象
const router: Router = express.Router()

// 添加 '/user' 前缀
router.use('/user', (req, res, next) => {
  next();
});

// 登陆
router.post("/user/login", (req: Request, res: Response) => {
  console.log(req.ip,'login=============>IP');    
  res.json({
    code: 200,
    message: "我登陆了",
  });
});

// 将路由对象共享出去
module.exports = router
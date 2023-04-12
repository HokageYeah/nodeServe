import { ValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// 函数柯力化（闭包处理）
module.exports = (validator: { run: (arg0: any) => any }[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(
      validator.map((validator: { run: (arg0: any) => any }) =>
        validator.run(req)
      )
    );
    const errors: ValidationError[] = validationResult(req).array();
    if (errors.length > 0) {
      const { value, msg, param, location } = errors[0];
      await next({ code: 401, message: `参数：${param}、值：${value}、错误信息：${msg}` })
      return;
    }
    await next();
  };
};

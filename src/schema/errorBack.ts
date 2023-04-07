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
    const errors :ValidationError[] = validationResult(req).array();
    if (errors.length > 0) {
      return res.status(401).json(errors[0]);
    }
    next();
  };
};
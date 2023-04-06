import { validationResult } from "express-validator";
import { Router, Request, Response, NextFunction } from "express";

module.exports = (validator: { run: (arg0: any) => any; }[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validator.map((validator: { run: (arg0: any) => any; }) => validator.run(req)))
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(401).json({ error: error })
        }
        next()
    }
}
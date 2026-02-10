import { Request, Response, NextFunction } from "express";

export function rollingSession(req: Request, res: Response, next: NextFunction) {
    // only roll for logged-in users
    if (req.session?.passport?.user) {
        req.session.lastActivity = Date.now();  // modify session → refresh cookie
    }
    next();
}

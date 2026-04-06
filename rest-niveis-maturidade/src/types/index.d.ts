import "express";
import "express-session";

declare module "express" {
  interface Request {
    userId?: number;
  }
}

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

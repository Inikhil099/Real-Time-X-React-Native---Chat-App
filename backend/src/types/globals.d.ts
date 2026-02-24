/// <reference types="@clerk/express/env" />

import type { Socket } from "socket.io";

declare global {
  namespace Express {
    interface Request {
      _id?: string;
    }
  }
}

declare module "socket.io" {
  interface Socket {
    userId?: string;
  }
}

export {};

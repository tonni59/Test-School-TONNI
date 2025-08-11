// backend/types/express/index.d.ts
declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        name?: string;
        email?: string;
      };
    }
  }
}

export {};

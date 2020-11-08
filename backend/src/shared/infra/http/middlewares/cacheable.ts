import mcache from 'memory-cache';
import { Request, NextFunction } from 'express';

// cache do lado do servidor
const cache = (duration: number) => {
  return (req: Request, res: any, next: NextFunction): void => {
    const key = `_express_${req.originalUrl}` || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody) {
      res.json(cachedBody);
    } else {
      res.sendResponse = res.json;
      res.json = (body: any) => {
        if (body.status !== 'error') {
          mcache.put(key, body, duration * 1000);
        }
        res.sendResponse(body);
      };
      next();
    }
  };
};

export default cache;

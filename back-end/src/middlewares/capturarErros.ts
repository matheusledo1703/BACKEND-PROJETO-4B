import type { Request, RequestHandler, Response } from 'express';

type Manipulador = (req: Request, res: Response) => Promise<void>;

export function capturarErros(manipulador: Manipulador): RequestHandler {
  return (req, res, next) => {
    manipulador(req, res).catch(next);
  };
}

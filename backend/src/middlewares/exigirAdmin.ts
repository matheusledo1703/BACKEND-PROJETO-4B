import type { RequestHandler } from 'express';
import { ErroDeAcessoNegado } from '@logica/erros';

export const exigirAdmin: RequestHandler = (_req, res, next) => {
  if (res.locals.ehAdmin !== true) {
    next(new ErroDeAcessoNegado('Só o administrador pode fazer isso.'));
    return;
  }
  next();
};

import type { RequestHandler } from 'express';
import { ErroNaoAutorizado } from '@logica/erros';
import type { ServicoDeAutenticacao } from '@logica/servicos';

// Protege uma rota: exige "Authorization: Bearer <token>" válido.
// Depois disso, o id de quem está logado fica em res.locals.usuarioId.
export function criarAutenticador(servico: ServicoDeAutenticacao): RequestHandler {
  return (req, res, next) => {
    const [tipo, token] = (req.headers.authorization ?? '').split(' ');

    if (tipo !== 'Bearer' || token === undefined || token === '') {
      next(new ErroNaoAutorizado('Faça login para continuar.'));
      return;
    }

    servico
      .identificar(token)
      .then((usuario) => {
        res.locals.usuarioId = usuario.id;
        next();
      })
      .catch(next);
  };
}

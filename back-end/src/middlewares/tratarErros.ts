import type { ErrorRequestHandler } from 'express';
import { ErroDeAplicacao } from '@logica/erros';

export const tratarErros: ErrorRequestHandler = (erro, _req, res, _next) => {
  if (erro instanceof ErroDeAplicacao) {
    res.status(erro.statusHttp).json({ erro: erro.message, campo: erro.campo });
    return;
  }

  if (erro instanceof SyntaxError) {
    res.status(400).json({ erro: 'O corpo da requisição não é um JSON válido.' });
    return;
  }

  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
};

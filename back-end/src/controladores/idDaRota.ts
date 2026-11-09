import type { Request } from 'express';
import { ErroDeValidacao } from '@logica/erros';

export function idDaRota(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    throw new ErroDeValidacao('id', 'O id da URL precisa ser um número inteiro maior que zero.');
  }
  return id;
}

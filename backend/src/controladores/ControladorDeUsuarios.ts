import type { Request, Response } from 'express';
import type { DadosDeUsuario, ServicoUsuario } from '@logica/servicos';
import { idDaRota } from './idDaRota';

export class ControladorDeUsuarios {
  constructor(private readonly servico: ServicoUsuario) {}

  cadastrar = async (req: Request, res: Response): Promise<void> => {
    const usuario = await this.servico.cadastrar(req.body as DadosDeUsuario);
    res.status(201).json(usuario.paraJSON());
  };

  // Dados de quem está logado
  eu = async (_req: Request, res: Response): Promise<void> => {
    const usuario = await this.servico.buscar(res.locals.usuarioId as number);
    res.json(usuario.paraJSON());
  };

  // Só o próprio usuário se edita (o serviço confere o id do token com o da URL)
  atualizar = async (req: Request, res: Response): Promise<void> => {
    const usuario = await this.servico.atualizar(res.locals.usuarioId as number, idDaRota(req), req.body as DadosDeUsuario);
    res.json(usuario.paraJSON());
  };
}

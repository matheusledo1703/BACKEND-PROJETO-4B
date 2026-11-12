import type { Request, Response } from 'express';
import type { DadosDeLogin, ServicoDeAutenticacao } from '@logica/servicos';

export class ControladorDeAutenticacao {
  constructor(private readonly servico: ServicoDeAutenticacao) {}

  entrar = async (req: Request, res: Response): Promise<void> => {
    const { usuario, token } = await this.servico.entrar(req.body as DadosDeLogin);
    res.json({ token, usuario: usuario.paraJSON() });
  };
}

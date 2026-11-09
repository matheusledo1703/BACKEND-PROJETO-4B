import type { Request, Response } from 'express';
import type { ServicoRelatorio } from '@logica/servicos';

export class ControladorDeRelatorios {
  constructor(private readonly servico: ServicoRelatorio) {}

  vendas = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.servico.vendas());
  };
}

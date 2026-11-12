import type { Request, Response } from 'express';
import type { Entidade } from '@logica/entidades';
import type { DadosDeRecurso, ServicoDeRecurso } from '@logica/servicos';
import { idDaRota } from './idDaRota';

// Um controlador só para os 4 CRUDs (categorias, produtos, clientes e pedidos)
export class ControladorDeRecurso<T extends Entidade> {
  constructor(private readonly servico: ServicoDeRecurso<T>) {}

  listar = async (req: Request, res: Response): Promise<void> => {
    const pagina = await this.servico.listar(req.query.pagina, req.query.limite);
    res.json({ ...pagina, itens: pagina.itens.map((item) => item.paraJSON()) });
  };

  buscar = async (req: Request, res: Response): Promise<void> => {
    res.json((await this.servico.buscar(idDaRota(req))).paraJSON());
  };

  criar = async (req: Request, res: Response): Promise<void> => {
    const criado = await this.servico.criar(req.body as DadosDeRecurso);
    res.status(201).json(criado.paraJSON());
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    const atualizado = await this.servico.atualizar(idDaRota(req), req.body as DadosDeRecurso);
    res.json(atualizado.paraJSON());
  };

  excluir = async (req: Request, res: Response): Promise<void> => {
    await this.servico.excluir(idDaRota(req));
    res.status(204).end();
  };
}

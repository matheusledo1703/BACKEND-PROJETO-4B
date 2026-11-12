import type { Request, Response } from 'express';
import type { DadosDeCompra, ServicoDeCompras, ServicoDeProdutos } from '@logica/servicos';

export class ControladorDeLoja {
  constructor(
    private readonly produtos: ServicoDeProdutos,
    private readonly compras: ServicoDeCompras
  ) {}

  vitrine = async (req: Request, res: Response): Promise<void> => {
    const pagina = await this.produtos.listar(req.query.pagina, req.query.limite);
    res.json({ ...pagina, itens: pagina.itens.map((produto) => produto.paraVitrine()) });
  };

  comprar = async (req: Request, res: Response): Promise<void> => {
    const pedido = await this.compras.comprar(res.locals.usuarioId as number, req.body as DadosDeCompra);
    res.status(201).json(pedido.paraCompra());
  };
}

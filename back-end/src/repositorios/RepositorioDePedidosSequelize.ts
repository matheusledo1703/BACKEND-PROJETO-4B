import type { Includeable } from 'sequelize';
import { Pedido } from '@logica/entidades';
import { ClienteModelo, PedidoModelo, ProdutoModelo } from '../modelos';
import { RepositorioSequelize } from './RepositorioSequelize';

export class RepositorioDePedidosSequelize extends RepositorioSequelize<Pedido, PedidoModelo> {
  constructor() {
    super(PedidoModelo);
  }

  protected incluir(): Includeable[] {
    return [
      { model: ClienteModelo, as: 'cliente' },
      { model: ProdutoModelo, as: 'produto' },
    ];
  }

  protected paraEntidade(registro: PedidoModelo): Pedido {
    return new Pedido(
      registro.id,
      registro.clienteId,
      registro.produtoId,
      registro.quantidade,
      Number(registro.valorUnitario),
      registro.createdAt,
      registro.cliente?.nome ?? null,
      registro.produto?.nome ?? null
    );
  }

  protected criarRegistro(pedido: Pedido): Promise<PedidoModelo> {
    return PedidoModelo.create({
      clienteId: pedido.clienteId,
      produtoId: pedido.produtoId,
      quantidade: pedido.quantidade,
      valorUnitario: pedido.valorUnitario,
      createdAt: pedido.criadoEm,
    });
  }

  protected copiarPara(registro: PedidoModelo, pedido: Pedido): void {
    registro.clienteId = pedido.clienteId;
    registro.produtoId = pedido.produtoId;
    registro.quantidade = pedido.quantidade;
    registro.valorUnitario = pedido.valorUnitario;
  }
}

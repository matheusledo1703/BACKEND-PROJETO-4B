import type { Includeable } from 'sequelize';
import { Produto } from '@logica/entidades';
import { CategoriaModelo, ProdutoModelo } from '../modelos';
import { RepositorioSequelize } from './RepositorioSequelize';

export class RepositorioDeProdutosSequelize extends RepositorioSequelize<Produto, ProdutoModelo> {
  constructor() {
    super(ProdutoModelo);
  }

  protected incluir(): Includeable[] {
    return [{ model: CategoriaModelo, as: 'categoria' }];
  }

  protected paraEntidade(registro: ProdutoModelo): Produto {
    return new Produto(
      registro.id,
      registro.nome,
      registro.descricao,
      Number(registro.preco),
      registro.categoriaId,
      registro.createdAt,
      registro.categoria?.nome ?? null,
      Number(registro.custo)
    );
  }

  protected criarRegistro(produto: Produto): Promise<ProdutoModelo> {
    return ProdutoModelo.create({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      custo: produto.custo,
      categoriaId: produto.categoriaId,
    });
  }

  protected copiarPara(registro: ProdutoModelo, produto: Produto): void {
    registro.nome = produto.nome;
    registro.descricao = produto.descricao;
    registro.preco = produto.preco;
    registro.custo = produto.custo;
    registro.categoriaId = produto.categoriaId;
  }
}

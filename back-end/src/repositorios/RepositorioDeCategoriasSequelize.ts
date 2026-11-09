import { Categoria } from '@logica/entidades';
import { CategoriaModelo } from '../modelos';
import { RepositorioSequelize } from './RepositorioSequelize';

export class RepositorioDeCategoriasSequelize extends RepositorioSequelize<Categoria, CategoriaModelo> {
  constructor() {
    super(CategoriaModelo);
  }

  protected paraEntidade(registro: CategoriaModelo): Categoria {
    return new Categoria(registro.id, registro.nome, registro.createdAt);
  }

  protected criarRegistro(categoria: Categoria): Promise<CategoriaModelo> {
    return CategoriaModelo.create({ nome: categoria.nome });
  }

  protected copiarPara(registro: CategoriaModelo, categoria: Categoria): void {
    registro.nome = categoria.nome;
  }
}

import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import type { Includeable, Model, ModelStatic } from 'sequelize';
import type { Pagina, ParametrosDePagina, Repositorio } from '@logica/contratos';
import type { Entidade } from '@logica/entidades';
import { ErroDeConflito, ErroNaoEncontrado } from '@logica/erros';
import { montarPagina } from '@logica/utils';

export abstract class RepositorioSequelize<T extends Entidade, M extends Model & { id: number }>
  implements Repositorio<T>
{
  constructor(protected readonly modelo: ModelStatic<M>) {}

  protected abstract paraEntidade(registro: M): T;
  protected abstract criarRegistro(entidade: T): Promise<M>;
  protected abstract copiarPara(registro: M, entidade: T): void;

  protected incluir(): Includeable[] {
    return [];
  }

  async listar(parametros: ParametrosDePagina): Promise<Pagina<T>> {
    const { rows, count } = await this.modelo.findAndCountAll({
      limit: parametros.limite,
      offset: (parametros.pagina - 1) * parametros.limite,
      order: [['id', 'DESC']],
      include: this.incluir(),
    });

    return montarPagina(rows.map((registro) => this.paraEntidade(registro)), count, parametros);
  }

  async listarTodos(): Promise<T[]> {
    const registros = await this.modelo.findAll({ order: [['id', 'ASC']], include: this.incluir() });
    return registros.map((registro) => this.paraEntidade(registro));
  }

  async buscarPorId(id: number): Promise<T | null> {
    const registro = await this.modelo.findByPk(id, { include: this.incluir() });
    return registro === null ? null : this.paraEntidade(registro);
  }

  async criar(entidade: T): Promise<T> {
    const registro = await this.executar(() => this.criarRegistro(entidade));
    return this.recarregar(registro.id);
  }

  async atualizar(entidade: T): Promise<T> {
    const registro = await this.modelo.findByPk(entidade.id);

    if (registro === null) {
      throw new ErroNaoEncontrado('registro', entidade.id);
    }

    this.copiarPara(registro, entidade);
    await this.executar(() => registro.save());
    return this.recarregar(entidade.id);
  }

  async excluir(id: number): Promise<void> {
    const registro = await this.modelo.findByPk(id);

    if (registro !== null) {
      await this.executar(() => registro.destroy());
    }
  }

  private async recarregar(id: number): Promise<T> {
    const entidade = await this.buscarPorId(id);

    if (entidade === null) {
      throw new ErroNaoEncontrado('registro', id);
    }
    return entidade;
  }

  protected async executar<R>(operacao: () => Promise<R>): Promise<R> {
    try {
      return await operacao();
    } catch (erro) {
      if (erro instanceof UniqueConstraintError) {
        throw new ErroDeConflito('Já existe um registro com esses dados.');
      }
      if (erro instanceof ForeignKeyConstraintError) {
        throw new ErroDeConflito('Não foi possível concluir: este registro está ligado a outros registros.');
      }
      throw erro;
    }
  }
}

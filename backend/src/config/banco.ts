import { DataTypes, Sequelize } from 'sequelize';
import { createConnection } from 'mysql2/promise';
import { ambiente } from './ambiente';

export const sequelize = new Sequelize(ambiente.banco.nome, ambiente.banco.usuario, ambiente.banco.senha, {
  host: ambiente.banco.host,
  port: ambiente.banco.porta,
  dialect: 'mysql',
  logging: false,
});

const COLUNAS_NOVAS = [
  { tabela: 'usuarios', coluna: 'papel', definicao: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'cliente' } },
  { tabela: 'produtos', coluna: 'custo', definicao: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 } },
  { tabela: 'pedidos', coluna: 'custoUnitario', definicao: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 } },
];

export async function adicionarColunasNovas(): Promise<void> {
  const consulta = sequelize.getQueryInterface();

  for (const { tabela, coluna, definicao } of COLUNAS_NOVAS) {
    const colunas = await consulta.describeTable(tabela);

    if (!(coluna in colunas)) {
      await consulta.addColumn(tabela, coluna, definicao);
    }
  }
}

export async function criarBancoSeNaoExistir(): Promise<void> {
  const conexao = await createConnection({
    host: ambiente.banco.host,
    port: ambiente.banco.porta,
    user: ambiente.banco.usuario,
    password: ambiente.banco.senha,
  });

  await conexao.query(`CREATE DATABASE IF NOT EXISTS \`${ambiente.banco.nome}\` CHARACTER SET utf8mb4`);
  await conexao.end();
}

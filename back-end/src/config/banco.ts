import { Sequelize } from 'sequelize';
import { createConnection } from 'mysql2/promise';
import { ambiente } from './ambiente';

export const sequelize = new Sequelize(ambiente.banco.nome, ambiente.banco.usuario, ambiente.banco.senha, {
  host: ambiente.banco.host,
  port: ambiente.banco.porta,
  dialect: 'mysql',
  logging: false,
});

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

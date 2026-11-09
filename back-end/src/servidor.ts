import { criarApp } from './app';
import { ambiente } from './config/ambiente';
import { criarBancoSeNaoExistir, sequelize } from './config/banco';

async function iniciar(): Promise<void> {
  await criarBancoSeNaoExistir();
  await sequelize.authenticate();
  await sequelize.sync();

  criarApp().listen(ambiente.porta, () => {
    console.log(`API rodando em http://localhost:${ambiente.porta}/api`);
  });
}

iniciar().catch((erro) => {
  console.error('Não foi possível iniciar a API. O MySQL do XAMPP está ligado?');
  console.error(erro);
  process.exit(1);
});

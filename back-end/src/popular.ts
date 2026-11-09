import { Categoria, Cliente, Pedido, Produto } from '@logica/entidades';
import { criarBancoSeNaoExistir, sequelize } from './config/banco';
import { montarSistema } from './composicao';

const PRODUTOS = [
  { nome: 'Chaveiro Coração', preco: 19.9, categoria: 'Chaveiros' },
  { nome: 'Chaveiro Gatinho', preco: 24.9, categoria: 'Chaveiros' },
  { nome: 'Quadro Pixel Art', preco: 89.9, categoria: 'Pixel Art' },
  { nome: 'Poster Pixel Dragão', preco: 129.9, categoria: 'Pixel Art' },
  { nome: 'Figure Raposa', preco: 299.99, categoria: 'Figures' },
  { nome: 'Figure Fênix', preco: 449.9, categoria: 'Figures' },
];

const CLIENTES = [
  { nome: 'Bianca Souza', email: 'bianca@email.com', telefone: '(43) 99999-0001' },
  { nome: 'Carlos Lima', email: 'carlos@email.com', telefone: '(43) 99999-0002' },
  { nome: 'Daniela Rocha', email: 'daniela@email.com', telefone: '' },
  { nome: 'Eduardo Alves', email: 'eduardo@email.com', telefone: '(43) 99999-0004' },
];

async function popular(): Promise<void> {
  await criarBancoSeNaoExistir();
  await sequelize.sync();

  const { repositorios } = montarSistema();

  if ((await repositorios.categorias.listarTodos()).length > 0) {
    console.log('O banco já tem dados. Nada foi feito.');
    return;
  }

  for (const nome of new Set(PRODUTOS.map((p) => p.categoria))) {
    await repositorios.categorias.criar(new Categoria(null, nome));
  }
  const categorias = await repositorios.categorias.listarTodos();

  for (const produto of PRODUTOS) {
    const categoria = categorias.find((c) => c.nome === produto.categoria);
    if (categoria !== undefined) {
      await repositorios.produtos.criar(new Produto(null, produto.nome, '', produto.preco, categoria.id));
    }
  }

  for (const cliente of CLIENTES) {
    await repositorios.clientes.criar(new Cliente(null, cliente.nome, cliente.email, cliente.telefone));
  }

  const produtos = await repositorios.produtos.listarTodos();
  const clientes = await repositorios.clientes.listarTodos();

  for (let i = 0; i < 40; i++) {
    const produto = produtos[i % produtos.length];
    const cliente = clientes[i % clientes.length];
    const quantidade = Math.max(1, Math.round(6 - produto.preco / 90 + Math.random() * 2));

    const data = new Date();
    data.setDate(data.getDate() - Math.floor(Math.random() * 180));

    await repositorios.pedidos.criar(new Pedido(null, cliente.id, produto.id, quantidade, produto.preco, data));
  }

  console.log('Pronto! Dados de exemplo criados: categorias, produtos, clientes e pedidos.');
}

popular()
  .catch((erro) => console.error('Erro ao popular o banco:', erro))
  .finally(() => sequelize.close());

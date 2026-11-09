import { Router } from 'express';
import type { RequestHandler } from 'express';
import type { Categoria, Cliente, Pedido, Produto } from '@logica/entidades';
import type {
  ControladorDeAutenticacao, ControladorDeRecurso, ControladorDeRelatorios, ControladorDeUsuarios,
} from '../controladores';
import { capturarErros } from '../middlewares';

export type Controladores = {
  autenticacao: ControladorDeAutenticacao;
  usuarios: ControladorDeUsuarios;
  categorias: ControladorDeRecurso<Categoria>;
  produtos: ControladorDeRecurso<Produto>;
  clientes: ControladorDeRecurso<Cliente>;
  pedidos: ControladorDeRecurso<Pedido>;
  relatorios: ControladorDeRelatorios;
};

// Rotas públicas: cadastro e login. O resto exige token (autenticar).
export function criarRotas(controladores: Controladores, autenticar: RequestHandler): Router {
  const roteador = Router();

  roteador.post('/usuarios', capturarErros(controladores.usuarios.cadastrar));
  roteador.post('/login', capturarErros(controladores.autenticacao.entrar));

  roteador.use(autenticar);

  roteador.get('/usuarios/eu', capturarErros(controladores.usuarios.eu));
  roteador.put('/usuarios/:id', capturarErros(controladores.usuarios.atualizar));

  const recursos = {
    categorias: controladores.categorias,
    produtos: controladores.produtos,
    clientes: controladores.clientes,
    pedidos: controladores.pedidos,
  };

  for (const [caminho, controlador] of Object.entries(recursos)) {
    roteador.get(`/${caminho}`, capturarErros(controlador.listar));
    roteador.get(`/${caminho}/:id`, capturarErros(controlador.buscar));
    roteador.post(`/${caminho}`, capturarErros(controlador.criar));
    roteador.put(`/${caminho}/:id`, capturarErros(controlador.atualizar));
    roteador.delete(`/${caminho}/:id`, capturarErros(controlador.excluir));
  }

  roteador.get('/relatorios/vendas', capturarErros(controladores.relatorios.vendas));

  return roteador;
}

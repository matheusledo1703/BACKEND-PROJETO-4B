import {
  ServicoDeAutenticacao, ServicoDeCategorias, ServicoDeClientes, ServicoDeCompras, ServicoDePedidos,
  ServicoDeProdutos, ServicoRelatorio, ServicoUsuario,
} from '@logica/servicos';
import { ambiente } from './config/ambiente';
import {
  ControladorDeAutenticacao, ControladorDeLoja, ControladorDeRecurso, ControladorDeRelatorios, ControladorDeUsuarios,
} from './controladores';
import { CriptografiaBcrypt } from './infra/CriptografiaBcrypt';
import { EmissorDeTokenJwt } from './infra/EmissorDeTokenJwt';
import {
  RepositorioDeCategoriasSequelize, RepositorioDeClientesSequelize, RepositorioDePedidosSequelize,
  RepositorioDeProdutosSequelize, RepositorioDeUsuariosSequelize,
} from './repositorios';

export function montarSistema() {
  const repositorios = {
    usuarios: new RepositorioDeUsuariosSequelize(),
    categorias: new RepositorioDeCategoriasSequelize(),
    produtos: new RepositorioDeProdutosSequelize(),
    clientes: new RepositorioDeClientesSequelize(),
    pedidos: new RepositorioDePedidosSequelize(),
  };

  const criptografia = new CriptografiaBcrypt();
  const emissor = new EmissorDeTokenJwt(ambiente.jwt.segredo, ambiente.jwt.expiraEm);

  const servicoDePedidos = new ServicoDePedidos(repositorios.pedidos, repositorios.clientes, repositorios.produtos);

  const servicos = {
    usuarios: new ServicoUsuario(repositorios.usuarios, criptografia),
    autenticacao: new ServicoDeAutenticacao(repositorios.usuarios, criptografia, emissor),
    categorias: new ServicoDeCategorias(repositorios.categorias),
    produtos: new ServicoDeProdutos(repositorios.produtos, repositorios.categorias),
    clientes: new ServicoDeClientes(repositorios.clientes),
    pedidos: servicoDePedidos,
    compras: new ServicoDeCompras(repositorios.usuarios, repositorios.clientes, servicoDePedidos),
    relatorio: new ServicoRelatorio(repositorios.pedidos, repositorios.produtos, repositorios.categorias),
  };

  const controladores = {
    autenticacao: new ControladorDeAutenticacao(servicos.autenticacao),
    usuarios: new ControladorDeUsuarios(servicos.usuarios),
    loja: new ControladorDeLoja(servicos.produtos, servicos.compras),
    categorias: new ControladorDeRecurso(servicos.categorias),
    produtos: new ControladorDeRecurso(servicos.produtos),
    clientes: new ControladorDeRecurso(servicos.clientes),
    pedidos: new ControladorDeRecurso(servicos.pedidos),
    relatorios: new ControladorDeRelatorios(servicos.relatorio),
  };

  return { repositorios, servicos, controladores };
}

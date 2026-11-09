import {
  ServicoDeAutenticacao, ServicoDeCategorias, ServicoDeClientes, ServicoDePedidos,
  ServicoDeProdutos, ServicoRelatorio, ServicoUsuario,
} from '@logica/servicos';
import { ambiente } from './config/ambiente';
import {
  ControladorDeAutenticacao, ControladorDeRecurso, ControladorDeRelatorios, ControladorDeUsuarios,
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

  const servicos = {
    usuarios: new ServicoUsuario(repositorios.usuarios, criptografia),
    autenticacao: new ServicoDeAutenticacao(repositorios.usuarios, criptografia, emissor),
    categorias: new ServicoDeCategorias(repositorios.categorias),
    produtos: new ServicoDeProdutos(repositorios.produtos, repositorios.categorias),
    clientes: new ServicoDeClientes(repositorios.clientes),
    pedidos: new ServicoDePedidos(repositorios.pedidos, repositorios.clientes, repositorios.produtos),
    relatorio: new ServicoRelatorio(repositorios.pedidos, repositorios.produtos, repositorios.categorias),
  };

  const controladores = {
    autenticacao: new ControladorDeAutenticacao(servicos.autenticacao),
    usuarios: new ControladorDeUsuarios(servicos.usuarios),
    categorias: new ControladorDeRecurso(servicos.categorias),
    produtos: new ControladorDeRecurso(servicos.produtos),
    clientes: new ControladorDeRecurso(servicos.clientes),
    pedidos: new ControladorDeRecurso(servicos.pedidos),
    relatorios: new ControladorDeRelatorios(servicos.relatorio),
  };

  return { repositorios, servicos, controladores };
}

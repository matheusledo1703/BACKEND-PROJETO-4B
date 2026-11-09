import { Cliente } from '@logica/entidades';
import { ClienteModelo } from '../modelos';
import { RepositorioSequelize } from './RepositorioSequelize';

export class RepositorioDeClientesSequelize extends RepositorioSequelize<Cliente, ClienteModelo> {
  constructor() {
    super(ClienteModelo);
  }

  protected paraEntidade(registro: ClienteModelo): Cliente {
    return new Cliente(registro.id, registro.nome, registro.email, registro.telefone, registro.createdAt);
  }

  protected criarRegistro(cliente: Cliente): Promise<ClienteModelo> {
    return ClienteModelo.create({ nome: cliente.nome, email: cliente.email, telefone: cliente.telefone });
  }

  protected copiarPara(registro: ClienteModelo, cliente: Cliente): void {
    registro.nome = cliente.nome;
    registro.telefone = cliente.telefone;
  }
}

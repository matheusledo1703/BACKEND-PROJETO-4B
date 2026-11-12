import type { RepositorioDeUsuarios } from '@logica/contratos';
import { Usuario } from '@logica/entidades';
import { UsuarioModelo } from '../modelos';
import { RepositorioSequelize } from './RepositorioSequelize';

export class RepositorioDeUsuariosSequelize
  extends RepositorioSequelize<Usuario, UsuarioModelo>
  implements RepositorioDeUsuarios
{
  constructor() {
    super(UsuarioModelo);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const registro = await UsuarioModelo.findOne({ where: { email } });
    return registro === null ? null : this.paraEntidade(registro);
  }

  async buscarPorCpf(cpf: string): Promise<Usuario | null> {
    const registro = await UsuarioModelo.findOne({ where: { cpf } });
    return registro === null ? null : this.paraEntidade(registro);
  }

  protected paraEntidade(registro: UsuarioModelo): Usuario {
    return new Usuario(
      registro.id,
      registro.nome,
      registro.email,
      registro.cpf,
      registro.senhaHash,
      registro.createdAt,
      registro.papel
    );
  }

  protected criarRegistro(usuario: Usuario): Promise<UsuarioModelo> {
    return UsuarioModelo.create(usuario.paraPersistencia());
  }

  protected copiarPara(registro: UsuarioModelo, usuario: Usuario): void {
    const dados = usuario.paraPersistencia();
    registro.nome = dados.nome;
    registro.cpf = dados.cpf;
    registro.senhaHash = dados.senhaHash;
  }
}

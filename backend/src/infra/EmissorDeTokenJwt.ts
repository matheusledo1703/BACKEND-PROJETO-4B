import { sign, verify } from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import type { DadosDoToken, EmissorDeToken } from '@logica/contratos';

// O token guarda só o id do usuário (nunca a senha ou o hash)
export class EmissorDeTokenJwt implements EmissorDeToken {
  constructor(
    private readonly segredo: string,
    private readonly expiraEm: SignOptions['expiresIn']
  ) {}

  emitir(dados: DadosDoToken): string {
    return sign({ sub: String(dados.usuarioId) }, this.segredo, { algorithm: 'HS256', expiresIn: this.expiraEm });
  }

  verificar(token: string): DadosDoToken | null {
    try {
      const conteudo = verify(token, this.segredo, { algorithms: ['HS256'] });
      if (typeof conteudo === 'string' || typeof conteudo.sub !== 'string') return null;

      const usuarioId = Number(conteudo.sub);
      return Number.isInteger(usuarioId) ? { usuarioId } : null;
    } catch {
      return null; // assinatura errada, token vencido ou mal formado
    }
  }
}

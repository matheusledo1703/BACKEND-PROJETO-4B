import { compare, hash } from 'bcryptjs';
import type { Criptografia } from '@logica/contratos';

export class CriptografiaBcrypt implements Criptografia {
  async gerarHash(senha: string): Promise<string> {
    return hash(senha, 10);
  }

  async comparar(senha: string, hashSalvo: string): Promise<boolean> {
    return compare(senha, hashSalvo);
  }
}

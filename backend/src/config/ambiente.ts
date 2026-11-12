import 'dotenv/config';
import type { SignOptions } from 'jsonwebtoken';

export const ambiente = {
  porta: Number(process.env.PORTA ?? 3000),
  banco: {
    host: process.env.DB_HOST ?? 'localhost',
    porta: Number(process.env.DB_PORTA ?? 3306),
    nome: process.env.DB_NOME ?? 'heartbeasties',
    usuario: process.env.DB_USUARIO ?? 'root',
    senha: process.env.DB_SENHA ?? '',
  },
  admin: {
    nome: process.env.ADMIN_NOME ?? 'Administrador',
    email: process.env.ADMIN_EMAIL ?? 'admin@heartbeasties.com',
    cpf: process.env.ADMIN_CPF ?? '11144477735',
    senha: process.env.ADMIN_SENHA ?? 'Admin@123',
  },
  jwt: {
    // Em produção, defina JWT_SEGREDO no .env (qualquer texto longo e difícil de adivinhar)
    segredo: process.env.JWT_SEGREDO ?? 'segredo-so-para-desenvolvimento-troque-no-env',
    expiraEm: (process.env.JWT_EXPIRA_EM ?? '1h') as SignOptions['expiresIn'],
  },
};

import cors from 'cors';
import express from 'express';
import type { Express } from 'express';
import { montarSistema } from './composicao';
import { criarAutenticador, tratarErros } from './middlewares';
import { criarRotas } from './rotas';

export function criarApp(sistema = montarSistema()): Express {
  const { controladores, servicos } = sistema;
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', criarRotas(controladores, criarAutenticador(servicos.autenticacao)));

  app.use(tratarErros);

  return app;
}

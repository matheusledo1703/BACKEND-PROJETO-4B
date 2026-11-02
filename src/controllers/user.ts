import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../entities/user.model";
import { Usuario, ValidationError } from "../domain/usuario";

// Cadastro de usuário
export async function createUser(req: Request, res: Response) {
  try {
    // As validações acontecem dentro da classe Usuario (setters)
    const usuario = new Usuario(
      req.body.nome,
      req.body.email,
      req.body.cpf,
      req.body.password,
    );

    const emailExiste = await User.findOne({ where: { email: usuario.email } });
    if (emailExiste) {
      return res.status(409).json({ campo: "email", mensagem: "Email já cadastrado" });
    }

    const cpfExiste = await User.findOne({ where: { cpf: usuario.cpf } });
    if (cpfExiste) {
      return res.status(409).json({ campo: "cpf", mensagem: "CPF já cadastrado" });
    }

    const salt = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const passwordHashed = await bcrypt.hash(usuario.senha, salt);

    const user = await User.create({
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      password: passwordHashed,
    });

    return res.status(201).json(user.convertToResponse());
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ campo: error.campo, mensagem: error.message });
    }
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

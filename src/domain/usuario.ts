// Classe de domínio: protege o estado interno (#campos privados)
// e só expõe get/set onde existe validação ou regra de negócio.

export class ValidationError extends Error {
  constructor(public readonly campo: string, mensagem: string) {
    super(mensagem);
    this.name = "ValidationError";
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarCpf(valor: string): boolean {
  const cpf = valor.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digito = (tamanho: number): number => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

// Nível de senha: mínimo 8, maiúscula, minúscula, número e símbolo
export function validarSenhaForte(senha: string): boolean {
  return (
    senha.length >= 8 &&
    /[A-Z]/.test(senha) &&
    /[a-z]/.test(senha) &&
    /\d/.test(senha) &&
    /[^A-Za-z0-9]/.test(senha)
  );
}

export class Usuario {
  #nome = "";
  #email = "";
  #cpf = "";
  #senha = "";

  constructor(nome: string, email: string, cpf: string, senha: string) {
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
    this.senha = senha;
  }

  get nome(): string {
    return this.#nome;
  }
  set nome(valor: string) {
    const nome = String(valor ?? "").trim();
    if (nome.length < 3) throw new ValidationError("nome", "Nome deve ter ao menos 3 caracteres");
    this.#nome = nome;
  }

  get email(): string {
    return this.#email;
  }
  set email(valor: string) {
    const email = String(valor ?? "").trim().toLowerCase();
    if (!EMAIL_REGEX.test(email)) throw new ValidationError("email", "Email inválido");
    this.#email = email;
  }

  get cpf(): string {
    return this.#cpf;
  }
  set cpf(valor: string) {
    const cpf = String(valor ?? "");
    if (!validarCpf(cpf)) throw new ValidationError("cpf", "CPF inválido");
    this.#cpf = cpf.replace(/\D/g, ""); // guarda só os números
  }

  get senha(): string {
    return this.#senha;
  }
  set senha(valor: string) {
    const senha = String(valor ?? "");
    if (!validarSenhaForte(senha)) {
      throw new ValidationError(
        "senha",
        "Senha fraca: use 8+ caracteres com maiúscula, minúscula, número e símbolo",
      );
    }
    this.#senha = senha;
  }
}

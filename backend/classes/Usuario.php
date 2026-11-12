<?php

class Usuario
{
    // private = só essa classe enxerga. o resto do código nem encosta.
    private string $nome = '';
    private string $email = '';
    private string $cpf = '';
    private string $senhaHash = '';

    // o construtor só chama os setters, assim nunca nasce um Usuario
    // com dado inválido (se algo estiver errado já estoura aqui)
    public function __construct(string $nome, string $email, string $cpf, string $senha)
    {
        $this->setNome($nome);
        $this->setEmail($email);
        $this->setCpf($cpf);
        $this->setSenha($senha);
    }

    
    // setters: cada um valida (ou transforma) antes de guardar.
    // se estiver errado, joga uma exceção com o campo e a mensagem.

    public function setNome(string $nome): void
    {
        $nome = trim($nome);

        if ($nome === '') {
            throw new CampoInvalidoException('nome', 'O nome é obrigatório.');
        }
        if (mb_strlen($nome) < 3) {
            throw new CampoInvalidoException('nome', 'O nome precisa ter pelo menos 3 letras.');
        }

        $this->nome = $nome;
    }

    public function setEmail(string $email): void
    {
        $email = strtolower(trim($email)); // e-mail sempre minúsculo

        if ($email === '') {
            throw new CampoInvalidoException('email', 'O e-mail é obrigatório.');
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new CampoInvalidoException('email', 'Digite um e-mail válido.');
        }

        $this->email = $email;
    }

    public function setCpf(string $cpf): void
    {
        // tira ponto e traço, fica só número
        $cpf = preg_replace('/\D/', '', $cpf);

        if ($cpf === '') {
            throw new CampoInvalidoException('cpf', 'O CPF é obrigatório.');
        }
        if (!self::cpfEhValido($cpf)) {
            throw new CampoInvalidoException('cpf', 'CPF inválido.');
        }

        $this->cpf = $cpf;
    }

    public function setSenha(string $senha): void
    {
        if ($senha === '') {
            throw new CampoInvalidoException('senha', 'A senha é obrigatória.');
        }

        // fraca = não passa. média ou forte = passa.
        if (self::nivelDaSenha($senha) === 'fraca') {
            throw new CampoInvalidoException(
                'senha',
                'Senha fraca. Use 8 caracteres ou mais, misturando pelo menos 3 destes: letra minúscula, letra maiúscula, número e símbolo.'
            );
        }

        // transforma: guarda só o hash. por isso não tem getSenha() em lugar nenhum
        $this->senhaHash = password_hash($senha, PASSWORD_DEFAULT);
    }

   
    public static function nivelDaSenha(string $senha): string
    {
        if (mb_strlen($senha) < 8) {
            return 'fraca';
        }

        $tipos = 0;
        if (preg_match('/[a-z]/', $senha)) $tipos++;
        if (preg_match('/[A-Z]/', $senha)) $tipos++;
        if (preg_match('/[0-9]/', $senha)) $tipos++;
        if (preg_match('/[^a-zA-Z0-9]/', $senha)) $tipos++;

        if ($tipos <= 2) return 'fraca';
        if ($tipos === 3) return 'media';
        return 'forte';
    }

  
    public static function cpfEhValido(string $cpf): bool
    {
        if (strlen($cpf) !== 11) {
            return false;
        }

        
        if (preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        
        for ($tamanho = 9; $tamanho <= 10; $tamanho++) {
            $soma = 0;
            for ($i = 0; $i < $tamanho; $i++) {
                $soma += (int) $cpf[$i] * (($tamanho + 1) - $i);
            }
            $digito = ($soma * 10) % 11;
            if ($digito === 10) {
                $digito = 0;
            }
            if ($digito !== (int) $cpf[$tamanho]) {
                return false;
            }
        }

        return true;
    }

   

    public function salvar(PDO $pdo): void
    {
        
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = :email");
        $stmt->execute(['email' => $this->email]);
        if ($stmt->fetch()) {
            throw new CampoInvalidoException('email', 'Já existe uma conta com esse e-mail.');
        }

        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE cpf = :cpf");
        $stmt->execute(['cpf' => $this->cpf]);
        if ($stmt->fetch()) {
            throw new CampoInvalidoException('cpf', 'Já existe uma conta com esse CPF.');
        }

        $stmt = $pdo->prepare(
            "INSERT INTO usuarios (nome, email, cpf, senha_hash)
             VALUES (:nome, :email, :cpf, :senha_hash)"
        );
        $stmt->execute([
            'nome' => $this->nome,
            'email' => $this->email,
            'cpf' => $this->cpf,
            'senha_hash' => $this->senhaHash,
        ]);
    }
}


class CampoInvalidoException extends InvalidArgumentException
{
    private string $campo;

    public function __construct(string $campo, string $mensagem)
    {
        parent::__construct($mensagem);
        $this->campo = $campo;
    }


    public function getCampo(): string
    {
        return $this->campo;
    }
}

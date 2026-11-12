

USE heartbeasties;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    cpf CHAR(11) NOT NULL,            -- só os 11 números, sem ponto nem traço
    senha_hash VARCHAR(255) NOT NULL, -- nunca guarda a senha em si, só o hash dela
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- segunda trava no banco: mesmo que o PHP deixe passar, o banco
    -- não aceita e-mail nem CPF repetido
    UNIQUE KEY uq_usuario_email (email),
    UNIQUE KEY uq_usuario_cpf (cpf)
);

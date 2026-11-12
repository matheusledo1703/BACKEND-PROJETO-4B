<?php


header('Content-Type: application/json; charset=utf-8');
require '../includes/db.php';
require '../classes/Usuario.php';


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Use o método POST.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

if (!is_array($dados)) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados inválidos.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    
    $usuario = new Usuario(
        (string) ($dados['nome'] ?? ''),
        (string) ($dados['email'] ?? ''),
        (string) ($dados['cpf'] ?? ''),
        (string) ($dados['senha'] ?? '')
    );

    $usuario->salvar($pdo);

    http_response_code(201);
    echo json_encode(['mensagem' => 'Cadastro realizado com sucesso!'], JSON_UNESCAPED_UNICODE);

} catch (CampoInvalidoException $e) {
    
    http_response_code(400);
    echo json_encode(
        ['error' => $e->getMessage(), 'campo' => $e->getCampo()],
        JSON_UNESCAPED_UNICODE
    );

} catch (PDOException $e) {
   
    http_response_code(500);
    echo json_encode(['error' => 'Não foi possível concluir o cadastro agora.'], JSON_UNESCAPED_UNICODE);
}

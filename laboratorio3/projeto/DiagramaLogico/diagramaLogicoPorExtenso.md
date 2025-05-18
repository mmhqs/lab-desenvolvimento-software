USUARIO: id (PK), nome, email, senha

ALUNO: usuario_id (FK), cpf (PK), rg, endereco, saldo_moedas, instituicao_id (FK)

PROFESSOR: usuario_id (FK), cpf (PK), departamento, saldo_moedas

EMPRESA_PARCEIRA: usuario_id (FK), cnpj (PK)

CURSO: id (PK), nome

VANTAGEM: id (PK), descricao, foto, custo_moedas ,empresa_cnpj (FK)

TRANSACAO: id (PK), data, quantidade_moedas, mensagem, remetente_id (FK), destinatario_id (FK)

CODIGO_TROCA: id (PK), valor

NOTIFICACAO_EMAIL: id (PK), mensagem, professor_id (FK), codigo_troca_id (FK)

CURSO_ALUNO: id (PK),aluno_id (FK), curso_id (FK)

PROFESSOR_INSTITUICAO: professor_id (FK), instituicao_id (FK)

ALUNO_VANTAGEM: id (PK), vantagem_id (FK), aluno_id (FK)


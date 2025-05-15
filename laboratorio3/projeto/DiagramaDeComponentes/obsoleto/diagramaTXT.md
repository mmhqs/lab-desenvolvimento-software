@startuml
package "Sistema de Mérito" {
    component "Frontend Web" as frontend {
        [Página web]
    }

    component "Backend" as backend {
        [Gerenciamento de Autenticação]
        [Gerenciamento de Alunos]
        [Gerenciamento de Professores]
        [Gerenciamento de Instituições]
        [Gerenciamento de Empresas]
        [Gerenciamento de Vantagens das Empresas]
        [Gerenciamento de Transações]
    }

    component "Banco de Dados" as bd {
        database "Entidades" as Entidade{
        [Tabela Usuario]
        [Tabela Aluno]
        [Tabela Professor]
        [Tabela EmpresaParceira]
        [Tabela Curso]
        [Tabela Vantagem]
        [Tabela NotificacaoEmail]
        [Tabela InstituicaoEnsino]
        [Tabela Transacao]
        [Tabela CodigoTroca]
        }
    }
}

frontend ..> backend : HTTPS

backend ..> bd :TCP/IP
@enduml
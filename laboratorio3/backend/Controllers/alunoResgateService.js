const email = require('../middlewares/email');
const alunoModel = require('../Models/alunoModel');
const empresaParceiraModel = require('../Models/empresaParceiraModel');
async function processarResgateDeVantagem(cpf, id_vantagem, result) {

//Buscar a vantagem pelo id_vantagem: abstração: o controller não sabe como a vantagem é obtida, isso está encapsulado no model.
    const vantagem = await empresaParceiraModel.getVantagemById(id_vantagem);

    if (!vantagem) {
        return {
            sucesso: true,
            mensagem: "Vantagem resgatada com sucesso! (email não enviado)",
            emailEnviado: false
        };
    }

// Buscar os dados do aluno e da empresa relacionados: independência funcional: os módulos tem coesão forte e acoplamento fraco.
    const [aluno, empresa] = await Promise.all([
        alunoModel.getAlunoComUsuario(cpf),
        empresaParceiraModel.getEmpresaComUsuarioByCnpj(vantagem.empresa_cnpj)
    ]);

    if (!aluno || !empresa) {
        return {
            sucesso: true,
            mensagem: "Vantagem resgatada com sucesso! (email não enviado)",
            emailEnviado: false
        };
    }
//Montar e enviar os e-mails: princípio da responsabilidade única: a lógica de comunicação (e-mail) foi separada do controller. Agora ele apenas aciona.
    const assuntoAluno = `Confirmação de Resgate - ${vantagem.descricao}`;
    const corpoAluno = `Olá ${aluno.nome}, você resgatou a vantagem "${vantagem.descricao}" da empresa ${empresa.nome_fantasia}. Código: ${vantagem.cupom}`;

    const assuntoEmpresa = `Novo resgate de vantagem - ${vantagem.descricao}`;
    const corpoEmpresa = `O aluno ${aluno.nome} resgatou a vantagem "${vantagem.descricao}".`;

    await Promise.all([
        email.enviarEmail(aluno.email, assuntoAluno, corpoAluno),
        email.enviarEmail(empresa.email, assuntoEmpresa, corpoEmpresa)
    ]);
    return {
        sucesso: true,
        mensagem: "Vantagem resgatada com sucesso e e-mails enviados.",
        emailEnviado: true
    };
}

module.exports = {
    processarResgateDeVantagem
};

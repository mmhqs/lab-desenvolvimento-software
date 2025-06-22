const professorModel = require('../Models/professorModel')
const alunoModel = require('../Models/alunoModel')
const email = require('../middlewares/email')

async function enviarMoedasEntreProfessorEAluno(professor_id, aluno_id, quantidade, motivo) {
    
  const resultado = await professorModel.enviarMoedas(professor_id, aluno_id, quantidade, motivo)

  const [professor, aluno] = await Promise.all([
    professorModel.getByUsuarioId(professor_id),
    alunoModel.getByUsuarioId(aluno_id)
  ])
  if (!professor || !aluno) {
    throw new Error('Professor ou aluno não encontrado')
  }

  const assunto = `Você recebeu ${quantidade} moeda(s)!`
  const corpo = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1a73e8; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🎉 Moedas Recebidas!</h1>
        </div>
        <div style="padding: 25px;">
            <p style="font-size: 16px;">Olá, <strong>${aluno.nome}</strong>!</p>
            <div style="background-color: #e8f0fe; border-left: 4px solid #1a73e8; padding: 12px; margin: 15px 0; border-radius: 0 4px 4px 0;">
                <p style="margin: 0; color: #1a73e8; font-weight: bold;">Você recebeu <span style="font-size: 18px;">${quantidade} moeda(s)</span> do professor ${professor.nome}!</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Motivo:</strong></p>
                <p style="margin: 5px 0 0 0;">${motivo || "Transferência de moedas"}</p>
            </div>
            <p style="font-size: 15px;">Aproveite suas moedas e continue com o excelente trabalho!</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #70757a; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0;">Sistema de Moedas Acadêmicas</p>
        </div>
    </div>
  `
  await email.enviarEmail(aluno.email, assunto, corpo)

  return resultado
}

module.exports = { enviarMoedasEntreProfessorEAluno }
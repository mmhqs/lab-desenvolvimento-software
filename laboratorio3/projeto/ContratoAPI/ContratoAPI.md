# getVantagens

const vantagensDisponiveis: Vantagem[] = [
  {
    id: 1,
    titulo: "Desconto em Restaurante",
    descricao: "20% de desconto em refeições no Restaurante X",
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg2oGaj2aelLlGLu092jD8WCkGURuQ4cv9FA&s",
    custo: 50,
  },
  {
    id: 2,
    titulo: "Material Escolar",
    descricao: "Kit completo de material escolar para seu filho",
    imagem: "https://static.vecteezy.com/system/resources/previews/025/221/322/non_2x/cartoon-student-cute-school-ai-generate-png.png",
    custo: 100,
  },
];

# getTransacoes

const transacoesMock: Transacao[] = [
  {
    id: 1,
    data: '2025-05-01T10:00:00Z',
    quantidadeMoedas: 50,
    mensagem: 'Recompensa por atividade',
    remetente: 2,
    destinatario: 1,
  },
  {
    id: 2,
    data: '2025-05-03T14:30:00Z',
    quantidadeMoedas: 20,
    mensagem: 'Compra de adesivo',
    remetente: 1,
    destinatario: 3,
  },
];

package com.lds.service;

import com.lds.entity.Transacao;
import com.lds.entity.Aluno;
import com.lds.entity.Vantagem;
import com.lds.entity.MoedaTransacao;
import com.lds.repository.TrocaRepository;
import com.lds.repository.AlunoRepository;
import com.lds.repository.VantagemRepository;
import com.lds.repository.TransacaoMoedaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TrocaService {
    private final TrocaRepository trocaRepository;
    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final TransacaoMoedaRepository transacaoMoedaRepository;

    @Autowired
    public TrocaService(TrocaRepository trocaRepository, AlunoRepository alunoRepository, VantagemRepository vantagemRepository, TransacaoMoedaRepository transacaoMoedaRepository) {
        this.trocaRepository = trocaRepository;
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
        this.transacaoMoedaRepository = transacaoMoedaRepository;
    }

    @Transactional
    public Transacao criarTroca(Long idAluno, Long idVantagem) {
        Aluno aluno= alunoRepository.findById(idAluno).orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        Vantagem vantagem = vantagemRepository.findById(idVantagem).orElseThrow(() -> new RuntimeException("Vantagem não encontrada"));

        if (!vantagem.isAtivo()) {
            throw new RuntimeException("Vantagem não está disponível");
        }

        if (aluno.getMoedas() < vantagem.getCustoEmMoedas()) {
            throw new RuntimeException("Saldo insuficiente de moedas");
        }

        aluno.setMoedas(aluno.getMoedas() - vantagem.getCustoEmMoedas());
        alunoRepository.save(aluno);

        MoedaTransacao transacao = new MoedaTransacao();
        transacao.setRemetente(aluno);
        transacao.setDestinatario(vantagem.getEmpresa());
        transacao.setQtd(vantagem.getCustoEmMoedas());
        transacao.setMotivo("Troca por vantagem: " + vantagem.getNome());
        transacao.setDatahr(LocalDateTime.now());
        transacao.setTipoTransacao("TROCA");
        transacaoMoedaRepository.save(transacao);

        Transacao troca = new Transacao();
        troca.setIdAluno(aluno);
        //troca.setAdvantage(advantage);
        troca.setDataTroca(LocalDateTime.now());
        troca.setCodTroca(UUID.randomUUID().toString());
        troca.setUsado(false);
        troca.setStatus("PENDENTE");
        
        return trocaRepository.save(troca);
    }

    public List<Transacao> getStudentExchanges(Long idAluno) {
        Aluno aluno= alunoRepository.findById(idAluno)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        return trocaRepository.encontrarPorAluno(aluno);
    }

    @Transactional
    public void validarTroca(String codigoTroca) {
        Transacao troca = trocaRepository.encontrarPorCodTroca(codigoTroca)
                .orElseThrow(() -> new RuntimeException("Código de troca inválido"));

        if (troca.isUsado()) {
            throw new RuntimeException("Código de troca já utilizado");
        }

        troca.setUsado(true);
        troca.setStatus("CONCLUIDO");
        trocaRepository.save(troca);
    }

    public List<Transacao> encontrarTrocasPendentes(Long idAluno) {
        Aluno aluno= alunoRepository.findById(idAluno)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        return trocaRepository.encontrarPorAlunoStatus(aluno, "PENDENTE");
    }
} 
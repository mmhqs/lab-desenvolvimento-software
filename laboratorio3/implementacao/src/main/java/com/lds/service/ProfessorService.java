package com.lds.service;

import com.lds.entity.Professor;
import com.lds.entity.Aluno;
import com.lds.entity.MoedaTransacao;
import com.lds.repository.ProfessorRepository;
import com.lds.repository.AlunoRepository;
import com.lds.repository.TransacaoMoedaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
@Service
public class ProfessorService {
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final TransacaoMoedaRepository transacaoMoedaRepository;

    @Autowired
    public ProfessorService(ProfessorRepository professorRepository,
                          AlunoRepository alunoRepository,
                          TransacaoMoedaRepository transacaoMoedaRepository) {
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.transacaoMoedaRepository = transacaoMoedaRepository;
    }

    @Transactional
    public Professor criaProfessor(Professor professor) {
        if (professorRepository.encontrarPorNumFuncionario(professor.getIdFuncionario()).isPresent()) {
            throw new RuntimeException("ID de funcionário já cadastrado");
        }
        return professorRepository.save(professor);
    }

    @Transactional
    public void addBonusSemestre(Long professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        professor.setMoedas(professor.getMoedas() + 1000);
        professorRepository.save(professor);
    }

    @Transactional
    public void tranferirMoedas(Long professorId, Long idAluno, Integer qtd, String motivo) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        Aluno aluno= alunoRepository.findById(idAluno)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        if (professor.getMoedas() < qtd) {
            throw new RuntimeException("Saldo insuficiente de moedas");
        }

        professor.setMoedas(professor.getMoedas() - qtd);
        professorRepository.save(professor);

        aluno.setMoedas(aluno.getMoedas() + qtd);
        alunoRepository.save(aluno);

        MoedaTransacao transacao = new MoedaTransacao();
        transacao.setRemetente(professor);
        transacao.setDestinatario(aluno);
        transacao.setQtd(qtd);
        transacao.setMotivo(motivo);
        transacao.setDatahr(LocalDateTime.now());
        transacao.setTipoTransacao("TRANSFERIR");
        transacaoMoedaRepository.save(transacao);
    }

    public Integer getMoedas(Long professorId) {
        return professorRepository.findById(professorId)
                .map(Professor::getMoedas)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
    }
} 
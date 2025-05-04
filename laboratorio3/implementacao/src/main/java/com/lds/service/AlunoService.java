package com.lds.service;

import com.lds.entity.Aluno;
import com.lds.entity.MoedaTransacao;
import com.lds.repository.AlunoRepository;
import com.lds.repository.TransacaoMoedaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AlunoService {
    private final AlunoRepository alunoRepository;
    private final TransacaoMoedaRepository transacaoMoedaRepository;

    @Autowired
    public AlunoService(AlunoRepository alunoRepository, 
                         TransacaoMoedaRepository transacaoMoedaRepository) {
        this.alunoRepository = alunoRepository;
        this.transacaoMoedaRepository = transacaoMoedaRepository;
    }

    @Transactional
    public Aluno criarAluno(Aluno aluno) {
        if (alunoRepository.encontrarPorNumRegistro(aluno.getNumRegistro()).isPresent()) {
            throw new RuntimeException("Número de matrícula já cadastrado");
        }
        return alunoRepository.save(aluno);
    }

    public Optional<Aluno> encontrarPorNumRegistro(String numRegistro) {
        return alunoRepository.encontrarPorNumRegistro(numRegistro);
    }

    public Integer getMoedas(Long idAluno) {
        return alunoRepository.findById(idAluno)
                .map(Aluno::getMoedas)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }

    public List<MoedaTransacao> getHistoricoTransacoes(Long idAluno) {
        Aluno aluno= alunoRepository.findById(idAluno)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        return transacaoMoedaRepository.encontrarPorRemOuDest(aluno, aluno);
    }

    @Transactional
    public void atualizarMoedas(Long idAluno, Integer amount) {
        Aluno aluno= alunoRepository.findById(idAluno)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        aluno.setMoedas(aluno.getMoedas() + amount);
        alunoRepository.save(aluno);
    }
} 
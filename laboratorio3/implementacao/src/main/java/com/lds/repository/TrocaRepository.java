package com.lds.repository;

import com.lds.entity.Transacao;
import com.lds.entity.Aluno;
import com.lds.entity.Vantagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrocaRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> encontrarPorAluno(Aluno aluno);
    List<Transacao> encontrarPorVantagem(Vantagem vantagem);
    Optional<Transacao> encontrarPorCodTroca(String codTroca);
    List<Transacao> encontrarPorAlunoStatus(Aluno aluno, String status);
} 
package com.lds.repository;

import com.lds.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    Optional<Aluno> encontrarPorNumRegistro(String numRegistro);
    Optional<Aluno> encontarPorEmail(String email);
} 
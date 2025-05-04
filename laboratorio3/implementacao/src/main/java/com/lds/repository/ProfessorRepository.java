package com.lds.repository;

import com.lds.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> encontrarPorNumFuncionario(String idFuncionario);
    Optional<Professor> encontarPorEmail(String email);
} 
package com.lds.repository;

import com.lds.entity.EmpresaParceira;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmpresaParceiraRepository extends JpaRepository<EmpresaParceira, Long> {
    Optional<EmpresaParceira> encontrarPorCnpj(String cnpj);
    Optional<EmpresaParceira> encontarPorEmail(String email);
} 
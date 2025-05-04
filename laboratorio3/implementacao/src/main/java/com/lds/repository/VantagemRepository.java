package com.lds.repository;

import com.lds.entity.Vantagem;
import com.lds.entity.EmpresaParceira;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VantagemRepository extends JpaRepository<Vantagem, Long> {
    List<Vantagem> encontrarPorEmpresa(EmpresaParceira empresa);
    List<Vantagem> encontrarPorEmpresaStatus(EmpresaParceira empresa, boolean ativo);
} 
package com.lds.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "partner_companies")
public class EmpresaParceira extends Usuario {
    @Column(nullable = false)
    private String cnpj;

    @Column(nullable = false)
    private String nomeEmpresa;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String telefone;
} 
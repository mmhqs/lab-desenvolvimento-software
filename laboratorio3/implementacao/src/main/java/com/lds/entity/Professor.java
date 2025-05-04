package com.lds.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "professores")
public class Professor extends Usuario {
    @Column(nullable = false)
    private String departamento;

    @Column(nullable = false)
    private Integer moedas = 0;

    @Column(nullable = false)
    private String idFuncionario;
} 
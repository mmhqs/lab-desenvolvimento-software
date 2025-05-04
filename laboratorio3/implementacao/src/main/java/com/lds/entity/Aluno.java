package com.lds.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "students")
public class Aluno extends Usuario {
    @Column(nullable = false)
    private String numRegistro;

    @Column(nullable = false)
    private String curso;

    @Column(nullable = false)
    private Integer moedas = 0;
} 
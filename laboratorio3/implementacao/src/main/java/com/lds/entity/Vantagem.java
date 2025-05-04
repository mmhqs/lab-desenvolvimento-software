package com.lds.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "vantagens")
public class Vantagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private EmpresaParceira empresa;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private Integer custoEmMoedas;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private boolean ativo = true;
}
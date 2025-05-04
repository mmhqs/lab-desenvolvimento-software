package com.lds.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "transacoes")
public class Transacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno idAluno;

    @ManyToOne
    @JoinColumn(name = "vantagem_id", nullable = false)
    private Vantagem idVantagem;

    @Column(nullable = false)
    private LocalDateTime dataTroca;

    @Column(nullable = false)
    private String codTroca;

    @Column(nullable = false)
    private boolean usado = false;

    @Column(nullable = false)
    private String status; // PENDETE, CONCLUIDA, CANCELADA
} 
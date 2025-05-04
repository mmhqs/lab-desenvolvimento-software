package com.lds.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "coin_transactions")
public class MoedaTransacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "remetente_id", nullable = false)
    private Usuario remetente;

    @ManyToOne
    @JoinColumn(name = "destinatario_id", nullable = false)
    private Usuario destinatario;

    @Column(nullable = false)
    private Integer qtd;

    @Column(nullable = false)
    private String motivo;

    @Column(nullable = false)
    private LocalDateTime datahr;

    @Column(nullable = false)
    private String tipoTransacao; // TRANSFERENCIA, TROCA, BONUS_SEMESTRAL
} 
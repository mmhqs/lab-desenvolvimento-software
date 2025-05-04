package com.lds.repository;

import com.lds.entity.MoedaTransacao;
import com.lds.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransacaoMoedaRepository extends JpaRepository<MoedaTransacao, Long> {
    List<MoedaTransacao> encontrarPorRemetente(Usuario remetente);
    List<MoedaTransacao> encontrarPorDestinatario(Usuario destinatario);
    List<MoedaTransacao> encontrarPorRemOuDest(Usuario user1, Usuario user2);
} 
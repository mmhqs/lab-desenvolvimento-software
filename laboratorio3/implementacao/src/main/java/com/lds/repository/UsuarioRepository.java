package com.lds.repository;

import com.lds.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> encontarPorEmail(String email);
    boolean existeEmail(String email);
    Optional<Usuario> encontarPorEmailSenha(String email, String senha);
} 
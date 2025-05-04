package com.lds.service;

import com.lds.entity.Usuario;
import com.lds.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Usuario criaUsuario(Usuario usuario) {
        if (usuarioRepository.existeEmail(usuario.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> encontarPorEmail(String email) {
        return usuarioRepository.encontarPorEmail(email);
    }

    public Optional<Usuario> atuenticar(String email, String password) {
        return usuarioRepository.encontarPorEmailSenha(email, password);
    }

    @Transactional
    public Usuario atualizarUsuario(Usuario usuario) {
        if (!usuarioRepository.existsById(usuario.getId())) {
            throw new RuntimeException("Usuário não encontrado");
        }
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void desativarUsuario(Long idUsuario) {
        usuarioRepository.findById(idUsuario).ifPresent(usuario -> {
            usuario.setAtivo(false);
            usuarioRepository.save(usuario);
        });
    }
} 
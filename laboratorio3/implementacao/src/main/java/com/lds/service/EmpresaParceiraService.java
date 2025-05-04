package com.lds.service;

import com.lds.entity.EmpresaParceira;
import com.lds.entity.Vantagem;
import com.lds.repository.EmpresaParceiraRepository;
import com.lds.repository.VantagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EmpresaParceiraService {
    private final EmpresaParceiraRepository empresaParceiraRepository;
    private final VantagemRepository vantagemRepository;

    @Autowired
    public EmpresaParceiraService(EmpresaParceiraRepository empresaParceiraRepository,
                               VantagemRepository vantagemRepository) {
        this.empresaParceiraRepository = empresaParceiraRepository;
        this.vantagemRepository = vantagemRepository;
    }

    @Transactional
    public EmpresaParceira criarEmpresaParceira(EmpresaParceira empresa) {
        if (empresaParceiraRepository.encontrarPorCnpj(empresa.getCnpj()).isPresent()) {
            throw new RuntimeException("CNPJ já cadastrado");
        }
        return empresaParceiraRepository.save(empresa);
    }

    @Transactional
    public Vantagem criarVantagem(Long idEmpresa, Vantagem vantagem) {
        EmpresaParceira empresa = empresaParceiraRepository.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        vantagem.setEmpresa(empresa);
        return vantagemRepository.save(vantagem);
    }

    public List<Vantagem> getVantagens(Long idEmpresa) {
        EmpresaParceira empresa = empresaParceiraRepository.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        return vantagemRepository.encontrarPorEmpresaStatus(empresa, true);
    }

    @Transactional
    public void atualizarVantagem(Long idEmpresa, Long idVantagem, Vantagem vantagemAtualizada) {
        EmpresaParceira empresa = empresaParceiraRepository.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        
        Vantagem vantagem = vantagemRepository.findById(idVantagem)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada"));

        if (!vantagem.getEmpresa().getId().equals(idEmpresa)) {
            throw new RuntimeException("Vantagem não pertence à empresa");
        }

        vantagem.setNome(vantagemAtualizada.getNome());
        vantagem.setDescricao(vantagemAtualizada.getDescricao());
        vantagem.setCustoEmMoedas(vantagemAtualizada.getCustoEmMoedas());
        vantagem.setImageUrl(vantagemAtualizada.getImageUrl());
        vantagem.setAtivo(vantagemAtualizada.isAtivo());

        vantagemRepository.save(vantagem);
    }

    @Transactional
    public void desativarVantagem(Long idEmpresa, Long idVantagem) {
        EmpresaParceira empresa = empresaParceiraRepository.findById(idEmpresa)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        
        Vantagem vantagem = vantagemRepository.findById(idVantagem)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada"));

        if (!vantagem.getEmpresa().getId().equals(idEmpresa)) {
            throw new RuntimeException("Vantagem não pertence à empresa");
        }

        vantagem.setAtivo(false);
        vantagemRepository.save(vantagem);
    }
} 
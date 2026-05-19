package com.venteapp.service;

import com.venteapp.dto.BusinessDTOs.*;
import com.venteapp.entity.Client;
import com.venteapp.exception.BusinessException;
import com.venteapp.repository.ClientRepository;
import com.venteapp.repository.VenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClientService {

    private final ClientRepository clientRepository;
    private final VenteRepository venteRepository;

    public List<ClientDTO> findAll() {
        return clientRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ClientDTO findById(Long id) {
        return toDTO(clientRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Client introuvable: " + id)));
    }

    public List<ClientDTO> search(String query) {
        return clientRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(query, query)
            .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public ClientDTO create(ClientDTO dto) {
        Client client = fromDTO(dto);
        return toDTO(clientRepository.save(client));
    }

    @Transactional
    public ClientDTO update(Long id, ClientDTO dto) {
        Client client = clientRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Client introuvable: " + id));

        client.setNom(dto.getNom());
        client.setPrenom(dto.getPrenom());
        client.setEmail(dto.getEmail());
        client.setTelephone(dto.getTelephone());
        client.setAdresse(dto.getAdresse());
        client.setVille(dto.getVille());
        client.setCodePostal(dto.getCodePostal());
        client.setPays(dto.getPays());
        client.setNumFiscal(dto.getNumFiscal());

        return toDTO(clientRepository.save(client));
    }

    @Transactional
    public void delete(Long id) {
        Client client = clientRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Client introuvable: " + id));
        client.setActif(false);
        clientRepository.save(client);
    }

    public ClientDTO toDTO(Client c) {
        List<com.venteapp.entity.Vente> ventes = venteRepository.findByClientId(c.getId());
        BigDecimal total = ventes.stream()
            .filter(v -> v.getStatut() != com.venteapp.entity.Vente.StatutVente.ANNULEE)
            .map(com.venteapp.entity.Vente::getTotalTtc)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ClientDTO.builder()
            .id(c.getId())
            .nom(c.getNom())
            .prenom(c.getPrenom())
            .email(c.getEmail())
            .telephone(c.getTelephone())
            .adresse(c.getAdresse())
            .ville(c.getVille())
            .codePostal(c.getCodePostal())
            .pays(c.getPays())
            .numFiscal(c.getNumFiscal())
            .actif(c.isActif())
            .createdAt(c.getCreatedAt())
            .nombreVentes(ventes.size())
            .totalAchats(total)
            .build();
    }

    private Client fromDTO(ClientDTO dto) {
        return Client.builder()
            .nom(dto.getNom())
            .prenom(dto.getPrenom())
            .email(dto.getEmail())
            .telephone(dto.getTelephone())
            .adresse(dto.getAdresse())
            .ville(dto.getVille())
            .codePostal(dto.getCodePostal())
            .pays(dto.getPays())
            .numFiscal(dto.getNumFiscal())
            .actif(true)
            .build();
    }
}

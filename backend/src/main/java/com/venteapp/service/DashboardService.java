package com.venteapp.service;

import com.venteapp.dto.BusinessDTOs.*;
import com.venteapp.entity.Vente;
import com.venteapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VenteRepository venteRepository;
    private final ClientRepository clientRepository;
    private final ProduitRepository produitRepository;
    private final VenteService venteService;

    public DashboardDTO getDashboard() {
        LocalDateTime debutMois = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMois = LocalDateTime.now();

        BigDecimal ca = venteRepository.sumTotalVentes();
        BigDecimal caMois = venteRepository.sumVentesPeriode(debutMois, finMois);
        long nbVentes = venteRepository.count();
        long nbVentesMois = venteRepository.countVentesPeriode(debutMois, finMois);
        long nbClients = clientRepository.countActifs();
        long nbProduits = produitRepository.countActifs();
        long stockFaible = produitRepository.countStockFaible();

        List<VenteDTO> dernieres = venteRepository.findRecentes().stream()
            .limit(5).map(venteService::toDTO).collect(Collectors.toList());

        // Stats par mois
        int annee = LocalDate.now().getYear();
        List<Object[]> rawStats = venteRepository.statsParMois(annee);
        String[] moisNoms = {"Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"};

        List<StatsMoisDTO> stats = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            final int mois = i;
            Optional<Object[]> found = rawStats.stream()
                .filter(r -> ((Number) r[0]).intValue() == mois)
                .findFirst();
            stats.add(StatsMoisDTO.builder()
                .mois(mois)
                .nomMois(moisNoms[i - 1])
                .total(found.map(r -> (BigDecimal) r[1]).orElse(BigDecimal.ZERO))
                .build());
        }

        return DashboardDTO.builder()
            .chiffreAffaires(ca != null ? ca : BigDecimal.ZERO)
            .chiffreAffairesMois(caMois != null ? caMois : BigDecimal.ZERO)
            .nombreVentes(nbVentes)
            .nombreVentesMois(nbVentesMois)
            .nombreClients(nbClients)
            .nombreProduits(nbProduits)
            .produitStockFaible(stockFaible)
            .dernieresVentes(dernieres)
            .statsParMois(stats)
            .build();
    }
}

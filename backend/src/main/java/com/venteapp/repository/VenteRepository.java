package com.venteapp.repository;

import com.venteapp.entity.Vente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VenteRepository extends JpaRepository<Vente, Long> {
    Optional<Vente> findByNumero(String numero);
    List<Vente> findByClientId(Long clientId);
    List<Vente> findByStatut(Vente.StatutVente statut);

    @Query("SELECT COALESCE(SUM(v.totalTtc), 0) FROM Vente v WHERE v.statut != 'ANNULEE'")
    BigDecimal sumTotalVentes();

    @Query("SELECT COALESCE(SUM(v.totalTtc), 0) FROM Vente v WHERE v.dateVente BETWEEN :debut AND :fin AND v.statut != 'ANNULEE'")
    BigDecimal sumVentesPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);

    @Query("SELECT COUNT(v) FROM Vente v WHERE v.dateVente BETWEEN :debut AND :fin")
    long countVentesPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);

    @Query("SELECT v FROM Vente v ORDER BY v.dateVente DESC")
    List<Vente> findRecentes();

    @Query("SELECT MONTH(v.dateVente) as mois, SUM(v.totalTtc) as total FROM Vente v " +
           "WHERE YEAR(v.dateVente) = :annee AND v.statut != 'ANNULEE' " +
           "GROUP BY MONTH(v.dateVente) ORDER BY mois")
    List<Object[]> statsParMois(@Param("annee") int annee);
}

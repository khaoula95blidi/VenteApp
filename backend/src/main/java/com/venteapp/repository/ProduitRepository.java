package com.venteapp.repository;

import com.venteapp.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    Optional<Produit> findByReference(String reference);
    boolean existsByReference(String reference);
    List<Produit> findByActifTrue();
    List<Produit> findByCategorieId(Long categorieId);

    @Query("SELECT p FROM Produit p WHERE p.stock <= p.stockMinimum AND p.actif = true")
    List<Produit> findStockFaible();

    @Query("SELECT COUNT(p) FROM Produit p WHERE p.actif = true")
    long countActifs();

    @Query("SELECT COUNT(p) FROM Produit p WHERE p.stock <= p.stockMinimum AND p.actif = true")
    long countStockFaible();
}

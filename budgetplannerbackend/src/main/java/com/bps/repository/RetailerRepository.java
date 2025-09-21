package com.bps.repository;

import com.bps.model.Retailer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RetailerRepository extends JpaRepository<Retailer, Long> {
    Optional<Retailer> findByName(String name);
}
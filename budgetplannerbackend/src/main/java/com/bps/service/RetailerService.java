package com.bps.service;

import com.bps.model.Retailer;
import java.util.List;
import java.util.Optional;

public interface RetailerService {
    Retailer saveRetailer(Retailer retailer);
    Retailer findById(Long id);
    Optional<Retailer> findByName(String name);
    List<Retailer> findAll();
    void deleteById(Long id);
}
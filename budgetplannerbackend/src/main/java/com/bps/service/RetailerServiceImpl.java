package com.bps.service;

import com.bps.model.Retailer;
import com.bps.repository.RetailerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RetailerServiceImpl implements RetailerService {

    @Autowired
    private RetailerRepository retailerRepository;

    @Override
    public Retailer saveRetailer(Retailer retailer) {
        if (retailer.getName() == null || retailer.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Retailer name is required");
        }
        return retailerRepository.save(retailer);
    }

    @Override
    public Retailer findById(Long id) {
        return retailerRepository.findById(id).orElse(null);
    }

    @Override
    public Optional<Retailer> findByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Retailer name cannot be null or empty");
        }
        return retailerRepository.findByName(name);
    }

    @Override
    public List<Retailer> findAll() {
        return retailerRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        retailerRepository.deleteById(id);
    }
}
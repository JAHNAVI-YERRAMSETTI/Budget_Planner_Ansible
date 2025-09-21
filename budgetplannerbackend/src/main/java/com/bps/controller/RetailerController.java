package com.bps.controller;

import com.bps.model.Retailer;
import com.bps.service.RetailerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/retailers")
public class RetailerController {
    @Autowired
    private RetailerService retailerService;

    @PostMapping
    public ResponseEntity<Retailer> saveRetailer(@RequestBody Retailer retailer) {
        Retailer saved = retailerService.saveRetailer(retailer);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Retailer> findById(@PathVariable Long id) {
        Retailer retailer = retailerService.findById(id);
        return retailer != null ? ResponseEntity.ok(retailer) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Retailer>> findAll() {
        return ResponseEntity.ok(retailerService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Retailer> updateRetailer(@PathVariable Long id, @RequestBody Retailer retailer) {
        retailer.setId(id);
        Retailer updated = retailerService.saveRetailer(retailer);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRetailer(@PathVariable Long id) {
        retailerService.deleteById(id);
        return ResponseEntity.ok("Retailer deleted successfully");
    }
}
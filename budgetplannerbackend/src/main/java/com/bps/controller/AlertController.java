package com.bps.controller;

import com.bps.model.Alert;
import com.bps.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/alerts")
public class AlertController {
    @Autowired
    private AlertService alertService;

    @PostMapping
    public ResponseEntity<Alert> saveAlert(@RequestBody Alert alert) {
        Alert saved = alertService.saveAlert(alert);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alert> getAlert(@PathVariable Long id) {
        Alert alert = alertService.findById(id);
        return alert != null ? ResponseEntity.ok(alert) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Alert>> getAllAlerts() {
        return ResponseEntity.ok(alertService.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Alert>> getAlertsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(alertService.findByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alert> updateAlert(@PathVariable Long id, @RequestBody Alert alert) {
        alert.setId(id);
        Alert updated = alertService.saveAlert(alert);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAlert(@PathVariable Long id) {
        alertService.deleteById(id);
        return ResponseEntity.ok("Alert deleted successfully");
    }
}
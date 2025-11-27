package com.bps.controller;

import com.bps.model.Alert;
import com.bps.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/alerts")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Alert>> getAlertsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(alertService.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Alert> createAlert(@RequestBody Alert alert) {
        return ResponseEntity.ok(alertService.saveAlert(alert));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alert> updateAlert(@PathVariable Long id, @RequestBody Alert alertDetails) {
        // This now correctly calls the update service method
        return ResponseEntity.ok(alertService.updateAlert(id, alertDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        // This now correctly calls the delete service method
        alertService.deleteAlert(id);
        // Returns a 204 No Content response, which is the standard for successful deletions
        return ResponseEntity.noContent().build();
    }
}

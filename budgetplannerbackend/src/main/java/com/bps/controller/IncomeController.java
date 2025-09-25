package com.bps.controller;

import com.bps.model.Income;
import com.bps.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/incomes")
public class IncomeController {
    @Autowired
    private IncomeService incomeService;

    @PostMapping
    public ResponseEntity<Income> saveIncome(@RequestBody Income income) {
        Income saved = incomeService.saveIncome(income);
        return ResponseEntity.ok(saved);
    } 

    @GetMapping("/{id}")
    public ResponseEntity<Income> getIncome(@PathVariable Long id) {
        Income income = incomeService.findById(id);
        return income != null ? ResponseEntity.ok(income) : ResponseEntity.notFound().build();
    }
    
    // UPDATED: This endpoint now gets ALL incomes for a user, ignoring date
    @GetMapping("/user/{userId}/all")
    public ResponseEntity<List<Income>> getAllIncomesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(incomeService.findByUserId(userId));
    }
    
    // UPDATED: This is now the primary endpoint to get incomes by month
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Income>> getIncomesByUserAndMonth(
            @PathVariable Long userId,
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(incomeService.findByUserIdAndMonth(userId, year, month));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Income> updateIncome(@PathVariable Long id, @RequestBody Income income) {
        income.setId(id);
        Income updated = incomeService.updateIncome(income);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.noContent().build();
    }
}

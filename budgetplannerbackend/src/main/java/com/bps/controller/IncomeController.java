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

    @GetMapping
    public ResponseEntity<List<Income>> getAllIncomes() {
        return ResponseEntity.ok(incomeService.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Income>> getIncomesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(incomeService.findByUserId(userId));
    }
}
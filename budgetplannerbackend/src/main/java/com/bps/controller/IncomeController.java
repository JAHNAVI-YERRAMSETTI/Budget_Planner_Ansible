package com.bps.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bps.model.Income;
import com.bps.service.IncomeService;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/income")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @PostMapping("/add")
    public ResponseEntity<String> addIncome(@RequestBody Income income) {
        String result = incomeService.addIncome(income);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Income>> getIncomeByUser(@PathVariable int userId) {
        List<Income> incomes = incomeService.getUserIncome(userId);
        return ResponseEntity.ok(incomes);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateIncome(@RequestBody Income income) {
        String result = incomeService.updateIncome(income);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{incomeId}")
    public ResponseEntity<String> deleteIncome(@PathVariable int incomeId) {
        String result = incomeService.deleteIncome(incomeId);
        return ResponseEntity.ok(result);
    }
}

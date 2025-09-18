package com.bps.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bps.model.Expense;
import com.bps.service.ExpenseService;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/expense")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("/add")
    public ResponseEntity<String> addExpense(@RequestBody Expense expense) {
        String result = expenseService.addExpense(expense);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Expense>> getExpensesByUser(@PathVariable int userId) {
        List<Expense> expenses = expenseService.getUserExpenses(userId);
        return ResponseEntity.ok(expenses);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateExpense(@RequestBody Expense expense) {
        String result = expenseService.updateExpense(expense);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{expenseId}")
    public ResponseEntity<String> deleteExpense(@PathVariable int expenseId) {
        String result = expenseService.deleteExpense(expenseId);
        return ResponseEntity.ok(result);
    }
}

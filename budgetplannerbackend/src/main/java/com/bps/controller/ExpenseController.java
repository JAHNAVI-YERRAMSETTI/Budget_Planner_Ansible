package com.bps.controller;

import com.bps.model.Expense;
import com.bps.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/expenses")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<Expense> saveExpense(@RequestBody Expense expense) {
        Expense saved = expenseService.saveExpense(expense);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpense(@PathVariable Long id) {
        Expense expense = expenseService.findById(id);
        return expense != null ? ResponseEntity.ok(expense) : ResponseEntity.notFound().build();
    }
    
    // UPDATED: This endpoint now gets ALL expenses for a user, ignoring date
    @GetMapping("/user/{userId}/all")
    public ResponseEntity<List<Expense>> getAllExpensesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(expenseService.findByUserId(userId));
    }
    
    // UPDATED: This is now the primary endpoint to get expenses by month
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Expense>> getExpensesByUserAndMonth(
            @PathVariable Long userId,
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(expenseService.findByUserIdAndMonth(userId, year, month));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        expense.setId(id);
        Expense updated = expenseService.updateExpense(expense);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
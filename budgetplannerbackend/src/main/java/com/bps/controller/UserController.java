package com.bps.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bps.model.Expense;
import com.bps.model.Income;
import com.bps.model.Transaction;
import com.bps.model.User;
import com.bps.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @PutMapping("/update")
    public ResponseEntity<String> updateProfile(@RequestBody User user) {
        try {
            String out = userService.updateUserProfile(user);
            return ResponseEntity.ok(out);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update user: " + e.getMessage());
        }
    }

    @GetMapping("/{uid}")
    public ResponseEntity<User> getUser(@PathVariable int uid) {
        User u = userService.getUserById(uid);
        if (u == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(u);
    }

    @PostMapping("/addIncome")
    public ResponseEntity<String> addIncome(@RequestBody Income income) {
        try {
            String out = userService.addIncome(income);
            return ResponseEntity.ok(out);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Add income failed: " + e.getMessage());
        }
    }

    @PostMapping("/addExpense")
    public ResponseEntity<String> addExpense(@RequestBody Expense expense) {
        try {
            String out = userService.addExpense(expense);
            return ResponseEntity.ok(out);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Add expense failed: " + e.getMessage());
        }
    }

    @GetMapping("/incomes/{uid}")
    public ResponseEntity<List<Transaction>> getIncomes(@PathVariable int uid) {
        return ResponseEntity.ok(userService.viewAllIncome(uid));
    }

    @GetMapping("/expenses/{uid}")
    public ResponseEntity<List<Transaction>> getExpenses(@PathVariable int uid) {
        return ResponseEntity.ok(userService.viewAllExpenses(uid));
    }

    @GetMapping("/totals/{uid}")
    public ResponseEntity<?> getTotals(@PathVariable int uid) {
        double income = userService.getTotalIncome(uid);
        double expense = userService.getTotalExpenses(uid);
        double balance = userService.getBalance(uid);
        return ResponseEntity.ok(new TotalsResponse(income, expense, balance));
    }

    // small response DTO
    static class TotalsResponse {
        public double totalIncome, totalExpense, balance;
        public TotalsResponse(double i, double e, double b) { this.totalIncome = i; this.totalExpense = e; this.balance = b; }
    }
}

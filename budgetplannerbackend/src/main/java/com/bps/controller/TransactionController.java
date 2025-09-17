package com.bps.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bps.model.Transaction;
import com.bps.service.TransactionService;

@RestController
@RequestMapping("/transaction")
@CrossOrigin("*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/add")
    public ResponseEntity<String> addTransaction(@RequestBody Transaction t) {
        try {
            String out = transactionService.addTransaction(t);
            return ResponseEntity.ok(out);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add transaction: " + e.getMessage());
        }
    }

    @GetMapping("/user/{uid}")
    public ResponseEntity<List<Transaction>> getByUser(@PathVariable int uid) {
        return ResponseEntity.ok(transactionService.getTransactionsByUser(uid));
    }

    @GetMapping("/user/{uid}/{type}")
    public ResponseEntity<List<Transaction>> getByUserAndType(@PathVariable int uid, @PathVariable String type) {
        return ResponseEntity.ok(transactionService.getTransactionsByUserAndType(uid, type.toUpperCase()));
    }
}

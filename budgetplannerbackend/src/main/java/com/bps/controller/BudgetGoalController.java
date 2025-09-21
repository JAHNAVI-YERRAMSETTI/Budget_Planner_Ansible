package com.bps.controller;

import com.bps.model.BudgetGoal;
import com.bps.service.BudgetGoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/budgetgoal")
public class BudgetGoalController {
    @Autowired
    private BudgetGoalService budgetGoalService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addBudgetGoal(@RequestBody BudgetGoal budgetGoal) {
        try {
            String result = budgetGoalService.addBudgetGoal(budgetGoal);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BudgetGoal>> getBudgetGoalsByUser(@PathVariable Long userId) {
        List<BudgetGoal> goals = budgetGoalService.getBudgetGoalsByUser(userId);
        return ResponseEntity.ok(goals);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateBudgetGoal(@PathVariable Long id, @RequestBody BudgetGoal budgetGoal) {
        try {
            budgetGoal.setId(id);
            String result = budgetGoalService.updateBudgetGoal(budgetGoal);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{budgetGoalId}")
    public ResponseEntity<?> deleteBudgetGoal(@PathVariable Long budgetGoalId) {
        String result = budgetGoalService.deleteBudgetGoal(budgetGoalId);
        return ResponseEntity.ok(Map.of("message", result));
    }
}
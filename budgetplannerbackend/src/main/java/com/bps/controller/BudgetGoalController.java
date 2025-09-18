package com.bps.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bps.model.BudgetGoal;
import com.bps.service.BudgetGoalService;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/budgetgoal")
public class BudgetGoalController {

    @Autowired
    private BudgetGoalService budgetGoalService;

    @PostMapping("/add")
    public ResponseEntity<String> addBudgetGoal(@RequestBody BudgetGoal budgetGoal) {
        String result = budgetGoalService.addBudgetGoal(budgetGoal);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{userid}")
    public ResponseEntity<List<BudgetGoal>> getBudgetGoalsByUser(@PathVariable int userid) {
        List<BudgetGoal> goals = budgetGoalService.getBudgetGoalsByUser(userid);
        return ResponseEntity.ok(goals);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateBudgetGoal(@RequestBody BudgetGoal budgetGoal) {
        String result = budgetGoalService.updateBudgetGoal(budgetGoal);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{budgetGoalId}")
    public ResponseEntity<String> deleteBudgetGoal(@PathVariable int budgetGoalId) {
        String result = budgetGoalService.deleteBudgetGoal(budgetGoalId);
        return ResponseEntity.ok(result);
    }
}

package com.bps.service;

import com.bps.model.BudgetGoal;
import java.util.List;

public interface BudgetGoalService {
    String addBudgetGoal(BudgetGoal budgetGoal);
    List<BudgetGoal> getBudgetGoalsByUser(Long userId);
    String updateBudgetGoal(BudgetGoal budgetGoal);
    String deleteBudgetGoal(Long budgetGoalId);
}
package com.bps.service;

import com.bps.model.BudgetGoal;
import java.util.List;

public interface BudgetGoalService {
    String addBudgetGoal(BudgetGoal budgetGoal);
    List<BudgetGoal> getBudgetGoalsByUser(int userid);
    String updateBudgetGoal(BudgetGoal budgetGoal);
    String deleteBudgetGoal(int budgetGoalId);
}

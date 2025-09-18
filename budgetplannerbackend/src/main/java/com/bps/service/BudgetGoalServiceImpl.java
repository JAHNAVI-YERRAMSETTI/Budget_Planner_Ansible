package com.bps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bps.model.BudgetGoal;
import com.bps.repository.BudgetGoalRepository;

import java.util.List;

@Service
public class BudgetGoalServiceImpl implements BudgetGoalService {

    @Autowired
    private BudgetGoalRepository budgetGoalRepository;

    @Override
    public String addBudgetGoal(BudgetGoal budgetGoal) {
        budgetGoalRepository.save(budgetGoal);
        return "Budget Goal added successfully";
    }

    @Override
    public List<BudgetGoal> getBudgetGoalsByUser(int userid) {
        return budgetGoalRepository.findByUserid(userid);
    }

    @Override
    public String updateBudgetGoal(BudgetGoal budgetGoal) {
        budgetGoalRepository.save(budgetGoal);
        return "Budget Goal updated successfully";
    }

    @Override
    public String deleteBudgetGoal(int budgetGoalId) {
        budgetGoalRepository.deleteById(budgetGoalId);
        return "Budget Goal deleted successfully";
    }
}

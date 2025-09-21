package com.bps.service;

import com.bps.model.BudgetGoal;
import com.bps.repository.BudgetGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class BudgetGoalServiceImpl implements BudgetGoalService {

    @Autowired
    private BudgetGoalRepository budgetGoalRepository;

    @Override
    public String addBudgetGoal(BudgetGoal budgetGoal) {
        if (budgetGoal.getUser() == null || budgetGoal.getUser().getId() == null || budgetGoal.getUser().getId() <= 0) {
            throw new IllegalArgumentException("Valid user ID is required");
        }
        if (budgetGoal.getCategory() == null || budgetGoal.getCategory().getId() == null || budgetGoal.getCategory().getId() <= 0) {
            throw new IllegalArgumentException("Valid category ID is required");
        }
        if (budgetGoal.getStartDate() == null) {
            budgetGoal.setStartDate(LocalDate.now().withDayOfMonth(1));
        }
        if (budgetGoal.getEndDate() == null) {
            budgetGoal.setEndDate(LocalDate.now().with(TemporalAdjusters.lastDayOfMonth()));
        }
        if (budgetGoal.getEndDate().isBefore(budgetGoal.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        if (budgetGoal.getMonthlyLimit() <= 0) {
            throw new IllegalArgumentException("Monthly limit must be greater than 0");
        }
        budgetGoalRepository.save(budgetGoal);
        return "Budget Goal added successfully";
    }

    @Override
    public List<BudgetGoal> getBudgetGoalsByUser(Long userId) {
        return budgetGoalRepository.findByUser_Id(userId);
    }

    @Override
    public String updateBudgetGoal(BudgetGoal budgetGoal) {
        if (budgetGoal.getId() == null) {
            throw new IllegalArgumentException("Budget Goal ID is required for update");
        }
        if (budgetGoal.getUser() == null || budgetGoal.getUser().getId() == null) {
            throw new IllegalArgumentException("Valid user ID is required");
        }
        if (budgetGoal.getCategory() == null || budgetGoal.getCategory().getId() == null) {
            throw new IllegalArgumentException("Valid category ID is required");
        }
        if (budgetGoal.getEndDate().isBefore(budgetGoal.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        budgetGoalRepository.save(budgetGoal);
        return "Budget Goal updated successfully";
    }

    @Override
    public String deleteBudgetGoal(Long budgetGoalId) {
        if (!budgetGoalRepository.existsById(budgetGoalId)) {
            throw new IllegalArgumentException("Budget Goal not found with ID: " + budgetGoalId);
        }
        budgetGoalRepository.deleteById(budgetGoalId);
        return "Budget Goal deleted successfully";
    }
}
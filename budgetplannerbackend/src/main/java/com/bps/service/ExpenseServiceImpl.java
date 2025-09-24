package com.bps.service;

import com.bps.model.*;
import com.bps.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private BudgetGoalRepository budgetGoalRepository;
    @Autowired
    private AlertRepository alertRepository;

    @Override
    public Expense saveExpense(Expense expense) {
        if (expense.getUser() == null || expense.getCategory() == null) {
            throw new IllegalArgumentException("User and Category are required for Expense");
        }
        if (expense.getExpenseDate() == null) {
            expense.setExpenseDate(LocalDate.now());
        }
        Expense savedExpense = expenseRepository.save(expense);
        checkBudgetGoals(savedExpense);
        return savedExpense;
    }

    @Override
    public Expense findById(Long id) {
        return expenseRepository.findById(id).orElse(null);
    }

    @Override
    public List<Expense> findAll() {
        return expenseRepository.findAll();
    }

    @Override
    public List<Expense> findByUserId(Long userId) {
        // Return all expenses for the user; frontend can filter by month
        return expenseRepository.findByUser_Id(userId);
    }

    @Override
    public void checkBudgetGoals(Expense expense) {
        if (expense.getCategory() != null && expense.getUser() != null) {
            LocalDate monthStart = expense.getExpenseDate().withDayOfMonth(1);
            LocalDate monthEnd = expense.getExpenseDate().with(TemporalAdjusters.lastDayOfMonth());

            Optional<BudgetGoal> optionalGoal = budgetGoalRepository.findByUser_IdAndCategory_Id(
                    expense.getUser().getId(), expense.getCategory().getId());

            if (optionalGoal.isPresent()) {
                BudgetGoal goal = optionalGoal.get();
                List<Expense> monthExpenses = expenseRepository.findByUser_IdAndCategory_IdAndExpenseDateBetween(
                        expense.getUser().getId(), expense.getCategory().getId(), monthStart, monthEnd);
                double totalSpent = monthExpenses.stream().mapToDouble(Expense::getAmount).sum();

                double percentageUsed = goal.getMonthlyLimit() > 0 ? (totalSpent / goal.getMonthlyLimit()) * 100 : 0;

                if (percentageUsed > goal.getWarningThreshold()) {
                    Alert alert = new Alert();
                    alert.setUser(expense.getUser());
                    alert.setMessage(String.format("Category '%s' has reached %.2f%% of its budget limit.", 
                            expense.getCategory().getName(), percentageUsed));
                    alert.setType("BUDGET_WARNING");
                    alert.setTimestamp(LocalDateTime.now());
                    alert.setResolved(false);
                    alertRepository.save(alert);
                }
            }
        }
    }

    // NEW: Update
    @Override
    public Expense updateExpense(Expense expense) {
        if (expense.getId() == null) {
            throw new IllegalArgumentException("Expense ID is required for update");
        }
        // Fetch existing to preserve associations if not provided (e.g., user/category)
        Optional<Expense> existingOpt = expenseRepository.findById(expense.getId());
        if (existingOpt.isPresent()) {
            Expense existing = existingOpt.get();
            if (expense.getCategory() == null) expense.setCategory(existing.getCategory());
            if (expense.getUser() == null) expense.setUser(existing.getUser());
            if (expense.getExpenseDate() == null) expense.setExpenseDate(existing.getExpenseDate());
        }
        Expense updated = expenseRepository.save(expense);
        checkBudgetGoals(updated);  // Re-check after update
        return updated;
    }

    // NEW: Delete
    @Override
    public void deleteExpense(Long id) {
        Optional<Expense> optional = expenseRepository.findById(id);
        if (optional.isPresent()) {
            expenseRepository.deleteById(id);
            // Optional: Adjust budget alerts or logs here
        } else {
            throw new IllegalArgumentException("Expense not found with id: " + id);
        }
    }
}
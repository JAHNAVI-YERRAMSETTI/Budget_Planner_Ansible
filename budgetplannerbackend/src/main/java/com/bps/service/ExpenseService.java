package com.bps.service;

import com.bps.model.Expense;
import java.util.List;

public interface ExpenseService {
    Expense saveExpense(Expense expense);
    Expense findById(Long id);
    List<Expense> findAll();
    List<Expense> findByUserId(Long userId);
    void checkBudgetGoals(Expense expense);
}
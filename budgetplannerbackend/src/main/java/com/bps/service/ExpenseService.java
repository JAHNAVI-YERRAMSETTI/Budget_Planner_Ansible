package com.bps.service;

import com.bps.model.Expense;
import java.util.List;

public interface ExpenseService {
    String addExpense(Expense expense);
    List<Expense> getUserExpenses(int userId);
    String updateExpense(Expense expense);
    String deleteExpense(int expenseId);
}

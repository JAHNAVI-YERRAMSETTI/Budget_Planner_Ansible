package com.bps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bps.model.Expense;
import com.bps.repository.ExpenseRepository;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Override
    public String addExpense(Expense expense) {
        expenseRepository.save(expense);
        return "Expense added successfully";
    }

    @Override
    public List<Expense> getUserExpenses(int userId) {
        return expenseRepository.findByUserId(userId);
    }

    @Override
    public String updateExpense(Expense expense) {
        expenseRepository.save(expense);
        return "Expense updated successfully";
    }

    @Override
    public String deleteExpense(int expenseId) {
        expenseRepository.deleteById(expenseId);
        return "Expense deleted successfully";
    }
}

package com.bps.service;

import com.bps.model.*;
import com.bps.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private RetailerRepository retailerRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ExpenseService expenseService;

    @Override
    public Transaction saveTransaction(Transaction transaction) {
        if (transaction.getUser() == null) {
            throw new IllegalArgumentException("User is required for Transaction");
        }
        if (transaction.getDate() == null) {
            transaction.setDate(LocalDate.now());
        }
        if (transaction.getRetailer() != null && transaction.getCategory() == null) {
            Optional<Retailer> optionalRetailer = retailerRepository.findByName(transaction.getRetailer());
            if (optionalRetailer.isPresent()) {
                Retailer retailer = optionalRetailer.get();
                Optional<Category> optionalCategory = categoryRepository.findByName(retailer.getDefaultCategory());
                if (optionalCategory.isPresent()) {
                    transaction.setCategory(optionalCategory.get());
                    transaction.setUserConfirmedCategory(false);
                }
            }
        }
        Transaction savedTransaction = transactionRepository.save(transaction);
        if (savedTransaction.getCategory() != null) {
            Expense dummyExpense = new Expense();
            dummyExpense.setUser(savedTransaction.getUser());
            dummyExpense.setCategory(savedTransaction.getCategory());
            dummyExpense.setAmount(savedTransaction.getAmount());
            dummyExpense.setExpenseDate(savedTransaction.getDate());
            expenseService.checkBudgetGoals(dummyExpense);
        }
        return savedTransaction;
    }

    @Override
    public Transaction findById(Long id) {
        return transactionRepository.findById(id).orElse(null);
    }

    @Override
    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

    @Override
    public List<Transaction> findByUserId(Long userId) {
        // Return all transactions for the user; frontend can filter by month
        return transactionRepository.findByUser_Id(userId);
    }

    @Override
    public void deleteById(Long id) {
        transactionRepository.deleteById(id);
    }
}
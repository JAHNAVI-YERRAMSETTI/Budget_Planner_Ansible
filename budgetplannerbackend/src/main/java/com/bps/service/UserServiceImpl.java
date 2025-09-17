package com.bps.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bps.exception.ResourceNotFoundException;
import com.bps.model.Expense;
import com.bps.model.Income;
import com.bps.model.Transaction;
import com.bps.model.User;
import com.bps.repository.TransactionRepository;
import com.bps.repository.UserRepository;

import java.time.LocalDate;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public String registerUser(User user) {
        userRepository.save(user);
        return "User Registered Successfully";
    }

    @Override
    public User checkUserLogin(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password);
    }

    @Override
    public String updateUserProfile(User user) {
        return userRepository.findById(user.getId()).map(existing -> {
            existing.setUsername(user.getUsername());
            existing.setEmail(user.getEmail());
            existing.setPhone(user.getPhone());
            existing.setGender(user.getGender());
            existing.setOccupation(user.getOccupation());
            if (user.getPassword() != null && !user.getPassword().isBlank()) {
                existing.setPassword(user.getPassword());
            }
            userRepository.save(existing);
            return "User Profile Updated Successfully";
        }).orElse("User ID Not Found to Update");
    }

    @Override
    public User getUserById(int uid) {
        return userRepository.findById(uid).orElse(null);
    }

    @Override
    public String addIncome(Income income) {
        User u = userRepository.findById(income.getUserId()).orElse(null);
        if (u == null) {
            throw new ResourceNotFoundException("User not found for id: " + income.getUserId());
        }
        Transaction t = new Transaction();
        t.setUser(u);
        t.setAmount(income.getAmount());
        t.setType("INCOME");
        t.setCategory(income.getCategory());
        t.setDescription(income.getDescription());
        t.setTransactionDate(income.getDate() != null ? income.getDate() : LocalDate.now());
        transactionRepository.save(t);
        return "Income Added Successfully";
    }

    @Override
    public String addExpense(Expense expense) {
        User u = userRepository.findById(expense.getUserId()).orElse(null);
        if (u == null) {
            throw new ResourceNotFoundException("User not found for id: " + expense.getUserId());
        }
        Transaction t = new Transaction();
        t.setUser(u);
        t.setAmount(expense.getAmount());
        t.setType("EXPENSE");
        t.setCategory(expense.getCategory());
        t.setDescription(expense.getDescription());
        t.setTransactionDate(expense.getDate() != null ? expense.getDate() : LocalDate.now());
        transactionRepository.save(t);
        return "Expense Added Successfully";
    }

    @Override
    public List<Transaction> viewAllIncome(int uid) {
        User u = userRepository.findById(uid).orElse(null);
        if (u == null) return List.of();
        return transactionRepository.findByUserAndType(u, "INCOME");
    }

    @Override
    public List<Transaction> viewAllExpenses(int uid) {
        User u = userRepository.findById(uid).orElse(null);
        if (u == null) return List.of();
        return transactionRepository.findByUserAndType(u, "EXPENSE");
    }

    @Override
    public double getTotalIncome(int uid) {
        return viewAllIncome(uid).stream().mapToDouble(Transaction::getAmount).sum();
    }

    @Override
    public double getTotalExpenses(int uid) {
        return viewAllExpenses(uid).stream().mapToDouble(Transaction::getAmount).sum();
    }

    @Override
    public double getBalance(int uid) {
        return getTotalIncome(uid) - getTotalExpenses(uid);
    }
}

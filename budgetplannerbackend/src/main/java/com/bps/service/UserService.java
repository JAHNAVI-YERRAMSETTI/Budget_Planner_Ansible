package com.bps.service;

import java.util.List;

import com.bps.model.User;
import com.bps.model.Expense;
import com.bps.model.Income;

public interface UserService {

    public String registerUser(User user);
    public User checkUserLogin(String username, String password);

    public String updateUserProfile(User user);
    public User getUserById(int uid);

    public String addIncome(Income income);
    public String addExpense(Expense expense);
    public List<Income> viewAllIncome(int uid);
    public List<Expense> viewAllExpenses(int uid);
    
    public double getTotalIncome(int uid);
    public double getTotalExpenses(int uid);
    public double getBalance(int uid);
}

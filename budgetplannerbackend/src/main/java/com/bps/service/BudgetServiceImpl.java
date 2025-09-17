// BudgetServiceImpl.java
package com.bps.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bps.model.Budget;
import com.bps.model.User;
import com.bps.repository.BudgetRepository;
import com.bps.repository.UserRepository;

@Service
public class BudgetServiceImpl implements BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Budget createBudget(Budget b) {
        return budgetRepository.save(b);
    }

    @Override
    public Budget updateBudget(Budget b) {
        Optional<Budget> ob = budgetRepository.findById(b.getId());
        if (ob.isPresent()) {
            Budget existing = ob.get();
            existing.setName(b.getName());
            existing.setTargetAmount(b.getTargetAmount());
            existing.setStartDate(b.getStartDate());
            existing.setEndDate(b.getEndDate());
            return budgetRepository.save(existing);
        }
        return null;
    }

    @Override
    public List<Budget> getBudgetsByUser(int uid) {
        User u = userRepository.findById(uid).orElse(null);
        if (u == null) return List.of();
        return budgetRepository.findByUser(u);
    }

    @Override
    public String deleteBudget(int bid) {
        if (budgetRepository.existsById(bid)) {
            budgetRepository.deleteById(bid);
            return "Budget Deleted";
        }
        return "Budget Not Found";
    }
}

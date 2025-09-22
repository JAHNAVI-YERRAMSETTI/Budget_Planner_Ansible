package com.bps.service;

import com.bps.model.Income;
import java.util.List;

public interface IncomeService {
    Income saveIncome(Income income);
    Income findById(Long id);
    List<Income> findAll();
    List<Income> findByUserId(Long userId);
    
    // NEW
    Income updateIncome(Income income);
    void deleteIncome(Long id);
}
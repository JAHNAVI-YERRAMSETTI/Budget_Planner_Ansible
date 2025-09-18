package com.bps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bps.model.Income;
import com.bps.repository.IncomeRepository;

import java.util.List;

@Service
public class IncomeServiceImpl implements IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Override
    public String addIncome(Income income) {
        incomeRepository.save(income);
        return "Income added successfully";
    }

    @Override
    public List<Income> getUserIncome(int userId) {
        return incomeRepository.findByUserId(userId);
    }

    @Override
    public String updateIncome(Income income) {
        incomeRepository.save(income);
        return "Income updated successfully";
    }

    @Override
    public String deleteIncome(int incomeId) {
        incomeRepository.deleteById(incomeId);
        return "Income deleted successfully";
    }
}

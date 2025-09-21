package com.bps.service;

import com.bps.model.Income;
import com.bps.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class IncomeServiceImpl implements IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Override
    public Income saveIncome(Income income) {
        if (income.getUser() == null) {
            throw new IllegalArgumentException("User is required for Income");
        }
        if (income.getDate() == null) {
            income.setDate(LocalDate.now());
        }
        return incomeRepository.save(income);
    }

    @Override
    public Income findById(Long id) {
        return incomeRepository.findById(id).orElse(null);
    }

    @Override
    public List<Income> findAll() {
        return incomeRepository.findAll();
    }

    @Override
    public List<Income> findByUserId(Long userId) {
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth());
        return incomeRepository.findByUser_IdAndDateBetween(userId, startOfMonth, endOfMonth);
    }
}
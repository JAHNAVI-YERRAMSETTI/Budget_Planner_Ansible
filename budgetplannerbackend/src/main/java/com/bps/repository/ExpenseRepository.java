package com.bps.repository;

import com.bps.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser_Id(Long userId);
    List<Expense> findByUser_IdAndExpenseDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    List<Expense> findByUser_IdAndCategory_IdAndExpenseDateBetween(Long userId, Long categoryId, LocalDate startDate, LocalDate endDate);
}
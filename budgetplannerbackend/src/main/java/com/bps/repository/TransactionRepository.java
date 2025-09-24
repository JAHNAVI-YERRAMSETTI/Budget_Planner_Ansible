package com.bps.repository;

import com.bps.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser_Id(Long userId);
    List<Transaction> findByUser_IdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
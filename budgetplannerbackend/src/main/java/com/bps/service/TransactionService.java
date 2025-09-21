package com.bps.service;

import com.bps.model.Transaction;
import java.util.List;

public interface TransactionService {
    Transaction saveTransaction(Transaction transaction);
    Transaction findById(Long id);
    List<Transaction> findAll();
    List<Transaction> findByUserId(Long userId);
    void deleteById(Long id);
}
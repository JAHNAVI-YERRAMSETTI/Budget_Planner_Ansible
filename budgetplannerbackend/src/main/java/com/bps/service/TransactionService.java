package com.bps.service;

import java.util.List;

import com.bps.model.Transaction;
import com.bps.model.User;

public interface TransactionService {
    String addTransaction(Transaction t);
    List<Transaction> getTransactionsByUser(int uid);
    List<Transaction> getTransactionsByUserAndType(int uid, String type);
}

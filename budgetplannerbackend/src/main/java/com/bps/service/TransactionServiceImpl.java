package com.bps.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bps.model.Transaction;
import com.bps.model.User;
import com.bps.repository.TransactionRepository;
import com.bps.repository.UserRepository;

@Service
public class TransactionServiceImpl implements TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public String addTransaction(Transaction t) {
        User u = userRepository.findById(t.getUser().getId()).orElse(null);
        if (u == null) return "User Not Found";
        t.setUser(u);
        transactionRepository.save(t);
        return "Transaction Saved";
    }

    @Override
    public List<Transaction> getTransactionsByUser(int uid) {
        User u = userRepository.findById(uid).orElse(null);
        if (u == null) return List.of();
        return transactionRepository.findByUser(u);
    }

    @Override
    public List<Transaction> getTransactionsByUserAndType(int uid, String type) {
        User u = userRepository.findById(uid).orElse(null);
        if (u == null) return List.of();
        return transactionRepository.findByUserAndType(u, type);
    }
}

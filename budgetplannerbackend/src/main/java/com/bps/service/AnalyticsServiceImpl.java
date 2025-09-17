// AnalyticsServiceImpl.java
package com.bps.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bps.model.Transaction;
import com.bps.repository.TransactionRepository;
import com.bps.repository.UserRepository;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Map<String, Double> getSummaryByUser(int uid) {
        var user = userRepository.findById(uid).orElse(null);
        Map<String, Double> m = new HashMap<>();
        if (user == null) {
            m.put("totalIncome", 0.0);
            m.put("totalExpense", 0.0);
            m.put("balance", 0.0);
            return m;
        }
        double income = transactionRepository.findByUserAndType(user, "INCOME").stream().mapToDouble(Transaction::getAmount).sum();
        double expense = transactionRepository.findByUserAndType(user, "EXPENSE").stream().mapToDouble(Transaction::getAmount).sum();
        m.put("totalIncome", income);
        m.put("totalExpense", expense);
        m.put("balance", income - expense);
        return m;
    }
}

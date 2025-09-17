package com.bps.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bps.model.Transaction;
import com.bps.model.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserAndType(User user, String type);
}

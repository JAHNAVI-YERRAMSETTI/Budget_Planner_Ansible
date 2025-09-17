package com.bps.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "transaction_table")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // user who owns this transaction
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Amount: positive double
    @Column(nullable = false)
    private double amount;

    // "INCOME" or "EXPENSE"
    @Column(length = 10, nullable = false)
    private String type;

    @Column(length = 100)
    private String category;

    @Column(length = 250)
    private String description;

    @Column(name = "transaction_date")
    private LocalDate transactionDate;

    public Transaction() {}

    // getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
}

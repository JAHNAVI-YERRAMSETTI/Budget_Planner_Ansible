package com.bps.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.List;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Expense> expenses;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<BudgetGoal> budgetGoals;

    // Default constructor
    public Category() {}

    // Constructor for full init
    public Category(String name) {
        this.name = name;
    }

    // JsonCreator for deserialization from ID stub {id: X}
    @JsonCreator
    public Category(@JsonProperty("id") Long id) {
        this.id = id;
    }

    // Getters and Setters remain the same
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<Expense> getExpenses() { return expenses; }
    public void setExpenses(List<Expense> expenses) { this.expenses = expenses; }
    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }
    public List<BudgetGoal> getBudgetGoals() { return budgetGoals; }
    public void setBudgetGoals(List<BudgetGoal> budgetGoals) { this.budgetGoals = budgetGoals; }
}
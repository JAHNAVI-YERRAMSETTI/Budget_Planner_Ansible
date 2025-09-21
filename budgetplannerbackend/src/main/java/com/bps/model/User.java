package com.bps.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name="`User`") // Use backticks to avoid conflict with SQL reserved keyword
@JsonIgnoreProperties(ignoreUnknown = true) // Ignores extra fields in JSON
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;
    private String role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-expense")
    private List<Expense> expenses;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-income")
    private List<Income> incomes;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-budgetgoal")
    private List<BudgetGoal> budgetGoals;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-analysisreport")
    private List<AnalysisReport> analysisReports;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-alert")
    private List<Alert> alerts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-transaction")
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-monthlyreport")  // Added for MonthlyReport
    private List<MonthlyReport> monthlyReports;

    // Default constructor
    public User() {}

    // JsonCreator for deserialization from ID stub {id: X}
    @JsonCreator
    public User(@JsonProperty("id") Long id) {
        this.id = id;
    }

    // Getters and Setters remain the same
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public List<Expense> getExpenses() { return expenses; }
    public void setExpenses(List<Expense> expenses) { this.expenses = expenses; }
    public List<Income> getIncomes() { return incomes; }
    public void setIncomes(List<Income> incomes) { this.incomes = incomes; }
    public List<BudgetGoal> getBudgetGoals() { return budgetGoals; }
    public void setBudgetGoals(List<BudgetGoal> budgetGoals) { this.budgetGoals = budgetGoals; }
    public List<AnalysisReport> getAnalysisReports() { return analysisReports; }
    public void setAnalysisReports(List<AnalysisReport> analysisReports) { this.analysisReports = analysisReports; }
    public List<Alert> getAlerts() { return alerts; }
    public void setAlerts(List<Alert> alerts) { this.alerts = alerts; }
    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }
    public List<MonthlyReport> getMonthlyReports() { return monthlyReports; }
    public void setMonthlyReports(List<MonthlyReport> monthlyReports) { this.monthlyReports = monthlyReports; }
}
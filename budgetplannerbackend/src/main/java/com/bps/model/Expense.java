package com.bps.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "expense")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    // Removed @JsonBackReference to allow serialization
    private Category category;

    private String description;
    private double amount;

    @Column(name = "expense_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expenseDate;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    // Optionally remove @JsonBackReference here too if user details are needed
    @JsonBackReference(value = "user-expense")  // Keep for now, as table doesn't use user
    private User user;

    public Expense() {}

    @JsonCreator
    public Expense(@JsonProperty("id") Long id) {
        this.id = id;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
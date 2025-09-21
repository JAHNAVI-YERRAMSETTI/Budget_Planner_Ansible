package com.bps.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class BudgetGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference(value = "user-budgetgoal")
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference(value = "category-budgetgoal")
    private Category category;

    private double monthlyLimit;
    private double warningThreshold;
    private boolean exceeded;
    private double previousMonthAmount;
    private double growthPercentage;
    private boolean tremendousGrowth;
    private LocalDate startDate;
    private LocalDate endDate;

    public BudgetGoal() {}

    // JsonCreator for deserialization from ID stub {id: X}
    @JsonCreator
    public BudgetGoal(@JsonProperty("id") Long id) {
        this.id = id;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public double getMonthlyLimit() { return monthlyLimit; }
    public void setMonthlyLimit(double monthlyLimit) { this.monthlyLimit = monthlyLimit; }
    public double getWarningThreshold() { return warningThreshold; }
    public void setWarningThreshold(double warningThreshold) { this.warningThreshold = warningThreshold; }
    public boolean isExceeded() { return exceeded; }
    public void setExceeded(boolean exceeded) { this.exceeded = exceeded; }
    public double getPreviousMonthAmount() { return previousMonthAmount; }
    public void setPreviousMonthAmount(double previousMonthAmount) { this.previousMonthAmount = previousMonthAmount; }
    public double getGrowthPercentage() { return growthPercentage; }
    public void setGrowthPercentage(double growthPercentage) { this.growthPercentage = growthPercentage; }
    public boolean isTremendousGrowth() { return tremendousGrowth; }
    public void setTremendousGrowth(boolean tremendousGrowth) { this.tremendousGrowth = tremendousGrowth; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    @JsonProperty("categoryId")
    public Long getCategoryId() {
        return category != null ? category.getId() : null;
    }
}
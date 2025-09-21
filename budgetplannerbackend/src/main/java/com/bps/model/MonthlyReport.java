package com.bps.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Map;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class MonthlyReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference(value = "user-monthlyreport")  // Matches User's managed ref (add to User if needed)
    private User user;
    
    private LocalDate month;
    private double totalIncome;
    private double totalExpense;
    private double savedAmount;
    private double spentPercentage;
    private double previousMonthSaved;
    private double sixMonthAverageSaved;
    private double yearlySaved;
    private double growthFromPrevious;
    private String highSpendingCategory;

    @ElementCollection
    @CollectionTable(name = "report_category_remaining", joinColumns = @JoinColumn(name = "report_id"))
    @MapKeyColumn(name = "category_name")
    @Column(name = "remaining_amount")
    private Map<String, Double> categoryRemaining;

    public MonthlyReport() {}

    // JsonCreator for deserialization from ID stub {id: X}
    @JsonCreator
    public MonthlyReport(@JsonProperty("id") Long id) {
        this.id = id;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDate getMonth() { return month; }
    public void setMonth(LocalDate month) { this.month = month; }
    public double getTotalIncome() { return totalIncome; }
    public void setTotalIncome(double totalIncome) { this.totalIncome = totalIncome; }
    public double getTotalExpense() { return totalExpense; }
    public void setTotalExpense(double totalExpense) { this.totalExpense = totalExpense; }
    public double getSavedAmount() { return savedAmount; }
    public void setSavedAmount(double savedAmount) { this.savedAmount = savedAmount; }
    public double getSpentPercentage() { return spentPercentage; }
    public void setSpentPercentage(double spentPercentage) { this.spentPercentage = spentPercentage; }
    public double getPreviousMonthSaved() { return previousMonthSaved; }
    public void setPreviousMonthSaved(double previousMonthSaved) { this.previousMonthSaved = previousMonthSaved; }
    public double getSixMonthAverageSaved() { return sixMonthAverageSaved; }
    public void setSixMonthAverageSaved(double sixMonthAverageSaved) { this.sixMonthAverageSaved = sixMonthAverageSaved; }
    public double getYearlySaved() { return yearlySaved; }
    public void setYearlySaved(double yearlySaved) { this.yearlySaved = yearlySaved; }
    public double getGrowthFromPrevious() { return growthFromPrevious; }
    public void setGrowthFromPrevious(double growthFromPrevious) { this.growthFromPrevious = growthFromPrevious; }
    public String getHighSpendingCategory() { return highSpendingCategory; }
    public void setHighSpendingCategory(String highSpendingCategory) { this.highSpendingCategory = highSpendingCategory; }
    public Map<String, Double> getCategoryRemaining() { return categoryRemaining; }
    public void setCategoryRemaining(Map<String, Double> categoryRemaining) { this.categoryRemaining = categoryRemaining; }
}
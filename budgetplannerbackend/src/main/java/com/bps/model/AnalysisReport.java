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
public class AnalysisReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonBackReference(value = "user-analysisreport")  // Matches User's managed ref
    private User user;

    private LocalDate reportDate;
    
    @ElementCollection
    @CollectionTable(name = "report_category_spending", joinColumns = @JoinColumn(name = "report_id"))
    @MapKeyColumn(name = "category_name")
    @Column(name = "amount_spent")
    private Map<String, Double> categorySpending;
    
    @ElementCollection
    @CollectionTable(name = "report_category_budgets", joinColumns = @JoinColumn(name = "report_id"))
    @MapKeyColumn(name = "category_name")
    @Column(name = "budget_limit")
    private Map<String, Double> categoryBudgets;
    
    private double totalSpent;
    private double totalSaved;
    private double spentPercentage;
    private double previousMonthComparison;
    private double sixMonthAverage;
    private double yearlyTotal;
    private String highSpendingCategory;
    private boolean hasTremendousGrowth;

    public AnalysisReport() {}

    // JsonCreator for deserialization from ID stub {id: X}
    @JsonCreator
    public AnalysisReport(@JsonProperty("id") Long id) {
        this.id = id;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public LocalDate getReportDate() { return reportDate; }
    public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }
    
    public Map<String, Double> getCategorySpending() { return categorySpending; }
    public void setCategorySpending(Map<String, Double> categorySpending) { this.categorySpending = categorySpending; }
    
    public Map<String, Double> getCategoryBudgets() { return categoryBudgets; }
    public void setCategoryBudgets(Map<String, Double> categoryBudgets) { this.categoryBudgets = categoryBudgets; }
    
    public double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(double totalSpent) { this.totalSpent = totalSpent; }
    
    public double getTotalSaved() { return totalSaved; }
    public void setTotalSaved(double totalSaved) { this.totalSaved = totalSaved; }
    
    public double getSpentPercentage() { return spentPercentage; }
    public void setSpentPercentage(double spentPercentage) { this.spentPercentage = spentPercentage; }
    
    public double getPreviousMonthComparison() { return previousMonthComparison; }
    public void setPreviousMonthComparison(double previousMonthComparison) { this.previousMonthComparison = previousMonthComparison; }
    
    public double getSixMonthAverage() { return sixMonthAverage; }
    public void setSixMonthAverage(double sixMonthAverage) { this.sixMonthAverage = sixMonthAverage; }
    
    public double getYearlyTotal() { return yearlyTotal; }
    public void setYearlyTotal(double yearlyTotal) { this.yearlyTotal = yearlyTotal; }
    
    public String getHighSpendingCategory() { return highSpendingCategory; }
    public void setHighSpendingCategory(String highSpendingCategory) { this.highSpendingCategory = highSpendingCategory; }
    
    public boolean isHasTremendousGrowth() { return hasTremendousGrowth; }
    public void setHasTremendousGrowth(boolean hasTremendousGrowth) { this.hasTremendousGrowth = hasTremendousGrowth; }
}
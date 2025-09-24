package com.bps.service;

import com.bps.model.*;
import com.bps.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalysisServiceImpl implements AnalysisService {
    @Autowired
    private AnalysisReportRepository analysisReportRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private IncomeRepository incomeRepository;
    @Autowired
    private BudgetGoalRepository budgetGoalRepository;
    @Autowired
    private AlertRepository alertRepository;
    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public AnalysisReport generateAnalysisReport(Long userId, Map<String, Double> categorySpending) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            // Set reportPeriod to first day of current month: only one report per-month
            LocalDate reportPeriod = LocalDate.now().withDayOfMonth(1);

            LocalDate startOfMonth = reportPeriod;
            LocalDate endOfMonth = reportPeriod.with(TemporalAdjusters.lastDayOfMonth());
            LocalDate startOfYear = reportPeriod.with(TemporalAdjusters.firstDayOfYear());
            LocalDate startOfSixMonthsAgo = reportPeriod.minusMonths(6).with(TemporalAdjusters.firstDayOfMonth());
            LocalDate startOfPreviousMonth = reportPeriod.minusMonths(1).with(TemporalAdjusters.firstDayOfMonth());
            LocalDate endOfPreviousMonth = reportPeriod.minusMonths(1).with(TemporalAdjusters.lastDayOfMonth());

            List<Expense> currentExpenses = expenseRepository.findByUser_IdAndExpenseDateBetween(userId, startOfMonth, endOfMonth);
            List<Income> currentIncomes = incomeRepository.findByUser_IdAndDateBetween(userId, startOfMonth, endOfMonth);
            List<Transaction> currentTransactions = transactionRepository.findByUser_IdAndDateBetween(userId, startOfMonth, endOfMonth);

            Map<String, Double> transactionSpending = currentTransactions.stream()
                    .filter(t -> t != null && t.isPaymentAppImport())
                    .collect(Collectors.groupingBy(
                            t -> {
                                if (t != null) {
                                    if (!t.isUserConfirmedCategory() && t.getRetailer() != null) {
                                        return t.getSuggestedCategory() != null ? t.getSuggestedCategory() : "Uncategorized";
                                    }
                                    return t.getCategory() != null ? t.getCategory().getName() : "Uncategorized";
                                }
                                return "Uncategorized";
                            },
                            Collectors.summingDouble(t -> t != null ? t.getAmount() : 0.0)
                    ));

            if (categorySpending == null) {
                categorySpending = new HashMap<>();
            }
            if (categorySpending.isEmpty()) {
                categorySpending.putAll(currentExpenses.stream()
                        .filter(exp -> exp != null)
                        .collect(Collectors.groupingBy(
                                exp -> exp.getCategory() != null ? exp.getCategory().getName() : "Uncategorized",
                                Collectors.summingDouble(exp -> exp != null ? exp.getAmount() : 0.0)
                        )));
                categorySpending.putAll(transactionSpending);
            }

            double totalExpense = (currentExpenses != null ? currentExpenses.stream().mapToDouble(Expense::getAmount).sum() : 0.0) +
                    (currentTransactions != null ? currentTransactions.stream().mapToDouble(Transaction::getAmount).sum() : 0.0);
            double totalIncome = (currentIncomes != null ? currentIncomes.stream().mapToDouble(Income::getAmount).sum() : 0.0);
            double totalSaved = totalIncome - totalExpense;
            double spentPercentage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

            String highSpendingCategory = categorySpending.entrySet().stream()
                    .max(Comparator.comparingDouble(Map.Entry::getValue))
                    .map(Map.Entry::getKey)
                    .orElse("None");

            List<Expense> prevExpenses = expenseRepository.findByUser_IdAndExpenseDateBetween(userId, startOfPreviousMonth, endOfPreviousMonth);
            List<Transaction> prevTransactions = transactionRepository.findByUser_IdAndDateBetween(userId, startOfPreviousMonth, endOfPreviousMonth);
            double prevTotalExpense = (prevExpenses != null ? prevExpenses.stream().mapToDouble(Expense::getAmount).sum() : 0.0) +
                    (prevTransactions != null ? prevTransactions.stream().mapToDouble(Transaction::getAmount).sum() : 0.0);
            double previousMonthComparison = prevTotalExpense > 0 ? ((totalExpense - prevTotalExpense) / prevTotalExpense) * 100 : 0;

            List<Expense> sixMonthExpenses = expenseRepository.findByUser_IdAndExpenseDateBetween(userId, startOfSixMonthsAgo, endOfMonth);
            List<Transaction> sixMonthTransactions = transactionRepository.findByUser_IdAndDateBetween(userId, startOfSixMonthsAgo, endOfMonth);
            double sixMonthTotal = (sixMonthExpenses != null ? sixMonthExpenses.stream().mapToDouble(Expense::getAmount).sum() : 0.0) +
                    (sixMonthTransactions != null ? sixMonthTransactions.stream().mapToDouble(Transaction::getAmount).sum() : 0.0);
            double sixMonthAverage = sixMonthTotal / 6;

            List<Expense> yearlyExpenses = expenseRepository.findByUser_IdAndExpenseDateBetween(userId, startOfYear, endOfMonth);
            List<Transaction> yearlyTransactions = transactionRepository.findByUser_IdAndDateBetween(userId, startOfYear, endOfMonth);
            double yearlyTotal = (yearlyExpenses != null ? yearlyExpenses.stream().mapToDouble(Expense::getAmount).sum() : 0.0) +
                    (yearlyTransactions != null ? yearlyTransactions.stream().mapToDouble(Transaction::getAmount).sum() : 0.0);

            boolean hasTremendousGrowth = previousMonthComparison > 50;

            List<BudgetGoal> userGoals = budgetGoalRepository.findByUser_Id(userId);
            Map<String, Double> categoryBudgets = new HashMap<>();
            for (BudgetGoal goal : userGoals) {
                String categoryName = goal.getCategory() != null ? goal.getCategory().getName() : "Uncategorized";
                categoryBudgets.put(categoryName, goal.getMonthlyLimit());
                double categorySpent = categorySpending.getOrDefault(categoryName, 0.0);
                double percentageUsed = goal.getMonthlyLimit() > 0 ? (categorySpent / goal.getMonthlyLimit()) * 100 : 0;

                goal.setExceeded(categorySpent > goal.getMonthlyLimit());
                goal.setGrowthPercentage(previousMonthComparison);
                goal.setTremendousGrowth(hasTremendousGrowth);
                goal.setPreviousMonthAmount(prevTotalExpense);
                budgetGoalRepository.save(goal);

                if (percentageUsed > goal.getWarningThreshold() && percentageUsed <= 100) {
                    Alert warning = new Alert();
                    warning.setUser(user);
                    warning.setMessage(String.format("Warning: %s category is at %.2f%% of its limit (%.2f/%.2f)",
                            categoryName, percentageUsed, categorySpent, goal.getMonthlyLimit()));
                    warning.setType("WARNING");
                    warning.setTimestamp(LocalDateTime.now());
                    warning.setResolved(false);
                    alertRepository.save(warning);
                }
                if (goal.isExceeded()) {
                    Alert exceed = new Alert();
                    exceed.setUser(user);
                    exceed.setMessage(String.format("Alert: %s category exceeded limit by %.2f (Limit: %.2f)",
                            categoryName, categorySpent - goal.getMonthlyLimit(), goal.getMonthlyLimit()));
                    exceed.setType("EXCEED");
                    exceed.setTimestamp(LocalDateTime.now());
                    exceed.setResolved(false);
                    alertRepository.save(exceed);

                    double remainingMonthlyGoal = totalSaved > 0 ? totalSaved : 0;
                    Alert recommendation = new Alert();
                    recommendation.setUser(user);
                    recommendation.setMessage(String.format("Recommendation: Use remaining %.2f from monthly goal for other categories.",
                            remainingMonthlyGoal));
                    recommendation.setType("RECOMMENDATION");
                    recommendation.setTimestamp(LocalDateTime.now());
                    recommendation.setResolved(false);
                    alertRepository.save(recommendation);
                }
            }

            if (hasTremendousGrowth) {
                Alert growthAlert = new Alert();
                growthAlert.setUser(user);
                growthAlert.setMessage("Tremendous growth in spending: " + previousMonthComparison + "% increase from previous month.");
                growthAlert.setType("GROWTH_ALERT");
                growthAlert.setTimestamp(LocalDateTime.now());
                growthAlert.setResolved(false);
                alertRepository.save(growthAlert);
            }

            // ---- FIX: Only one report per-user-per-month (reportPeriod = 1st of month) ----
            Optional<AnalysisReport> existingReportOpt = analysisReportRepository.findByUser_IdAndReportDate(userId, reportPeriod);
            AnalysisReport report;
            if (existingReportOpt.isPresent()) {
                report = existingReportOpt.get();
            } else {
                report = new AnalysisReport();
                report.setUser(user);
                report.setReportDate(reportPeriod);
            }
            // Make ABSOLUTELY SURE the field is always the 1st of month!
            report.setReportDate(reportPeriod);

            report.setCategorySpending(categorySpending);
            report.setCategoryBudgets(categoryBudgets);
            report.setTotalSpent(totalExpense);
            report.setTotalSaved(totalSaved);
            report.setSpentPercentage(spentPercentage);
            report.setPreviousMonthComparison(previousMonthComparison);
            report.setSixMonthAverage(sixMonthAverage);
            report.setYearlyTotal(yearlyTotal);
            report.setHighSpendingCategory(highSpendingCategory);
            report.setHasTremendousGrowth(hasTremendousGrowth);

            return analysisReportRepository.save(report);

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate analysis report: " + e.getMessage(), e);
        }
    }

    @Override
    public AnalysisReport getLatestReport(Long userId) {
        try {
            if (userId == null) {
                throw new IllegalArgumentException("User ID cannot be null");
            }
            Optional<AnalysisReport> latestReport = analysisReportRepository.findTopByUser_IdOrderByReportDateDesc(userId);
            return latestReport.orElse(null);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve latest report: " + e.getMessage(), e);
        }
    }

    @Override
    public List<AnalysisReport> getAllReports(Long userId) {
        try {
            if (userId == null) {
                throw new IllegalArgumentException("User ID cannot be null");
            }
            return analysisReportRepository.findByUser_IdOrderByReportDateDesc(userId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve reports: " + e.getMessage(), e);
        }
    }
}

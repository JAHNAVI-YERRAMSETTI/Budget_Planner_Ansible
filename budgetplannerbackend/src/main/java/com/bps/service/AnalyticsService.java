// AnalyticsService.java
package com.bps.service;
import java.util.Map;

public interface AnalyticsService {
    Map<String, Double> getSummaryByUser(int uid); // totalIncome, totalExpense, balance
}

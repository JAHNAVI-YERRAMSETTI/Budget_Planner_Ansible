package com.bps.service;

import com.bps.model.AnalysisReport;
import java.util.List;
import java.util.Map;

public interface AnalysisService {
    AnalysisReport generateAnalysisReport(Long userId, Map<String, Double> categorySpending);
    AnalysisReport getLatestReport(Long userId);
    List<AnalysisReport> getAllReports(Long userId);
}
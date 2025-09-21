package com.bps.service;

import com.bps.model.MonthlyReport;
import java.util.List;

public interface ReportService {
    MonthlyReport saveReport(MonthlyReport report);
    MonthlyReport findById(Long id);
    List<MonthlyReport> findAll();
    List<MonthlyReport> findByUserId(Long userId);
}
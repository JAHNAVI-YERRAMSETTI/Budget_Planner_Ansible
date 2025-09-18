package com.bps.service;

import com.bps.model.MonthlyReport;
import java.util.List;

public interface ReportService {
    List<MonthlyReport> getReportsByUser(int userid);
    String addMonthlyReport(MonthlyReport report);
    String deleteReport(int reportId);
}

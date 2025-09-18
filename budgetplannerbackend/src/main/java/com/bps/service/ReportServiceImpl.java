package com.bps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bps.model.MonthlyReport;
import com.bps.repository.MonthlyReportRepository;

import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private MonthlyReportRepository monthlyReportRepository;

    @Override
    public List<MonthlyReport> getReportsByUser(int userid) {
        return monthlyReportRepository.findByUserid(userid);
    }

    @Override
    public String addMonthlyReport(MonthlyReport report) {
        monthlyReportRepository.save(report);
        return "Report added successfully";
    }

    @Override
    public String deleteReport(int reportId) {
        monthlyReportRepository.deleteById(reportId);
        return "Report deleted successfully";
    }
}

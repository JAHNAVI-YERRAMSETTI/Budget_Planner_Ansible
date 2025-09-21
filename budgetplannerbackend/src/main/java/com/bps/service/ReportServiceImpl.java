package com.bps.service;

import com.bps.model.MonthlyReport;
import com.bps.model.User;
import com.bps.repository.MonthlyReportRepository;
import com.bps.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private MonthlyReportRepository monthlyReportRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public MonthlyReport saveReport(MonthlyReport report) {
        if (report.getUser() == null) {
            throw new IllegalArgumentException("User is required for MonthlyReport");
        }
        if (report.getMonth() == null) {
            report.setMonth(LocalDate.now().withDayOfMonth(1));
        }
        return monthlyReportRepository.save(report);
    }

    @Override
    public MonthlyReport findById(Long id) {
        return monthlyReportRepository.findById(id).orElse(null);
    }

    @Override
    public List<MonthlyReport> findAll() {
        return monthlyReportRepository.findAll();
    }

    @Override
    public List<MonthlyReport> findByUserId(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return List.of();
        return monthlyReportRepository.findByUser_Id(userId);
    }
}
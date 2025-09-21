package com.bps.controller;

import com.bps.model.MonthlyReport;
import com.bps.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @PostMapping
    public ResponseEntity<MonthlyReport> saveReport(@RequestBody MonthlyReport report) {
        MonthlyReport saved = reportService.saveReport(report);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MonthlyReport> getReport(@PathVariable Long id) {
        MonthlyReport report = reportService.findById(id);
        return report != null ? ResponseEntity.ok(report) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<MonthlyReport>> getAllReports() {
        return ResponseEntity.ok(reportService.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MonthlyReport>> getReportsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reportService.findByUserId(userId));
    }

    @GetMapping("/comparison/user/{userId}")
    public ResponseEntity<List<MonthlyReport>> getMonthlyComparisons(@PathVariable Long userId) {
        return ResponseEntity.ok(reportService.findByUserId(userId));
    }
}
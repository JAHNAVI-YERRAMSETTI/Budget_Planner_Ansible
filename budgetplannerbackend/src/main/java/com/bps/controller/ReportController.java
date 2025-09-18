package com.bps.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bps.model.MonthlyReport;
import com.bps.service.ReportService;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/report")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/user/{userid}")
    public ResponseEntity<List<MonthlyReport>> getReportsByUser(@PathVariable int userid) {
        List<MonthlyReport> reports = reportService.getReportsByUser(userid);
        return ResponseEntity.ok(reports);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addReport(@RequestBody MonthlyReport report) {
        String result = reportService.addMonthlyReport(report);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{reportId}")
    public ResponseEntity<String> deleteReport(@PathVariable int reportId) {
        String result = reportService.deleteReport(reportId);
        return ResponseEntity.ok(result);
    }
}

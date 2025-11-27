package com.bps.controller;

import com.bps.model.MonthlyReport;
import com.bps.service.ExcelExportService;
import com.bps.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;
    
    @Autowired
    private ExcelExportService excelExportService;

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
    
    @GetMapping("/user/{userId}/comprehensive")
    public ResponseEntity<Map<String, Object>> getComprehensiveReport(
            @PathVariable Long userId,
            @RequestParam int year,
            @RequestParam int month) {
        Map<String, Object> report = reportService.generateComprehensiveReport(userId, year, month);
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/user/{userId}/export")
    public ResponseEntity<InputStreamResource> exportReportAsExcel(
            @PathVariable Long userId,
            @RequestParam int year,
            @RequestParam int month) throws IOException {
        
        Map<String, Object> reportData = reportService.generateComprehensiveReport(userId, year, month);
        ByteArrayInputStream in = excelExportService.createExcelReport(reportData);

        HttpHeaders headers = new HttpHeaders();
        String filename = String.format("Budget-Report-%d-%02d.xlsx", year, month);
        headers.add("Content-Disposition", "attachment; filename=" + filename);

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}

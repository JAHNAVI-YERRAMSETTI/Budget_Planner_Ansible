package com.bps.controller;

import com.bps.model.AnalysisReport;
import com.bps.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {
    @Autowired
    private AnalysisService analysisService;

    @PostMapping
    public ResponseEntity<AnalysisReport> generateReport(@RequestParam Long userId, @RequestBody Map<String, Double> categorySpending) {
        AnalysisReport report = analysisService.generateAnalysisReport(userId, categorySpending);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/all/{userId}")
    public ResponseEntity<List<AnalysisReport>> getAllReports(@PathVariable Long userId) {
        List<AnalysisReport> reports = analysisService.getAllReports(userId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<AnalysisReport> getLatestReport(@PathVariable Long userId) {
        AnalysisReport report = analysisService.getLatestReport(userId);
        return report != null ? ResponseEntity.ok(report) : ResponseEntity.notFound().build();
    }
}
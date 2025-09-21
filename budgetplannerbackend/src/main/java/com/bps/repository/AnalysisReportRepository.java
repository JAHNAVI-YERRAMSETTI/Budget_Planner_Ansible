package com.bps.repository;

import com.bps.model.AnalysisReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnalysisReportRepository extends JpaRepository<AnalysisReport, Long> {
    Optional<AnalysisReport> findTopByUser_IdOrderByReportDateDesc(Long userId);
}
package com.bps.repository;

import com.bps.model.AnalysisReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AnalysisReportRepository extends JpaRepository<AnalysisReport, Long> {
    Optional<AnalysisReport> findTopByUser_IdOrderByReportDateDesc(Long userId);
    List<AnalysisReport> findByUser_IdOrderByReportDateDesc(Long userId);
    
    // NEW: For duplicate check
    @Query("SELECT r FROM AnalysisReport r WHERE r.user.id = :userId AND r.reportDate = :date")
    Optional<AnalysisReport> findByUser_IdAndReportDate(@Param("userId") Long userId, @Param("date") LocalDate date);
}
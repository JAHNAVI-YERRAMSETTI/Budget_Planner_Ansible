package com.bps.repository;

import com.bps.model.MonthlyReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MonthlyReportRepository extends JpaRepository<MonthlyReport, Long> {
    List<MonthlyReport> findByUser_Id(Long userId);
}
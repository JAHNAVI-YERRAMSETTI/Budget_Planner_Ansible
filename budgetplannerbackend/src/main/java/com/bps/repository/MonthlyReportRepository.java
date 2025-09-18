package com.bps.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.bps.model.MonthlyReport;

import java.util.List;

@Repository
public interface MonthlyReportRepository extends JpaRepository<MonthlyReport, Integer> {
    List<MonthlyReport> findByUserid(int userid);
}

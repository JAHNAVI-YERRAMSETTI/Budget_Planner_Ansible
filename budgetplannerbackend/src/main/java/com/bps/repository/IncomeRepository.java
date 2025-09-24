package com.bps.repository;

import com.bps.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUser_Id(Long userId);
    List<Income> findByUser_IdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT i FROM Income i WHERE i.user.id = :userId AND i.date BETWEEN :startDate AND :endDate")
    List<Income> findIncomesByUserAndDateRange(@Param("userId") Long userId, 
                                              @Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);
}
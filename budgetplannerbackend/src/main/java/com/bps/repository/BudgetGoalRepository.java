package com.bps.repository;

import com.bps.model.BudgetGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetGoalRepository extends JpaRepository<BudgetGoal, Long> {
    List<BudgetGoal> findByUser_Id(Long userId);
    Optional<BudgetGoal> findByUser_IdAndCategory_Id(Long userId, Long categoryId);
}
package com.bps.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.bps.model.BudgetGoal;

import java.util.List;

@Repository
public interface BudgetGoalRepository extends JpaRepository<BudgetGoal, Integer> {
    List<BudgetGoal> findByUserid(int userid);
}

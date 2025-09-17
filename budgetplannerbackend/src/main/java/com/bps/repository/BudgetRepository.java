package com.bps.repository;

public interface BudgetRepository extends JpaRepository<Budget, Integer> {
    List<Budget> findByUser(User user);
}

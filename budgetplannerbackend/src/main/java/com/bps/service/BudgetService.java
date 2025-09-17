// BudgetService.java
package com.bps.service;
import java.util.List;
import com.bps.model.Budget;

public interface BudgetService {
    Budget createBudget(Budget b);
    Budget updateBudget(Budget b);
    List<Budget> getBudgetsByUser(int uid);
    String deleteBudget(int bid);
}

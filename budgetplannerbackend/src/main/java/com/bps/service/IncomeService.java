package com.bps.service;

import com.bps.model.Income;
import java.util.List;

public interface IncomeService {
    String addIncome(Income income);
    List<Income> getUserIncome(int userId);
    String updateIncome(Income income);
    String deleteIncome(int incomeId);
}

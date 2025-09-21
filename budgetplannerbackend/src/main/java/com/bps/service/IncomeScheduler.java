package com.bps.service;

import com.bps.model.Income;
import com.bps.model.User;
import com.bps.repository.IncomeRepository;
import com.bps.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class IncomeScheduler {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserRepository userRepository;

    @Scheduled(cron = "0 0 0 1 * ?") // Run on the first day of every month at midnight
    public void repeatMonthlyIncomes() {
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate previousMonthStart = currentMonth.minusMonths(1);
        LocalDate previousMonthEnd = currentMonth.minusDays(1);

        List<User> users = userRepository.findAll();
        for (User user : users) {
            List<Income> previousIncomes = incomeRepository.findByUser_IdAndDateBetween(user.getId(), previousMonthStart, previousMonthEnd);
            for (Income income : previousIncomes) {
                Income newIncome = new Income();
                newIncome.setUser(user);
                newIncome.setAmount(income.getAmount());
                newIncome.setSource(income.getSource());
                newIncome.setDescription(income.getDescription());
                newIncome.setDate(currentMonth);
                incomeRepository.save(newIncome);
            }
        }
    }
}
// GoalServiceImpl.java
package com.bps.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bps.model.Goal;
import com.bps.model.User;
import com.bps.repository.GoalRepository;
import com.bps.repository.UserRepository;

@Service
public class GoalServiceImpl implements GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Goal createGoal(Goal g) {
        return goalRepository.save(g);
    }

    @Override
    public Goal updateGoal(Goal g) {
        Optional<Goal> og = goalRepository.findById(g.getId());
        if (og.isPresent()) {
            Goal existing = og.get();
            existing.setTitle(g.getTitle());
            existing.setTargetAmount(g.getTargetAmount());
            existing.setDueDate(g.getDueDate());
            return goalRepository.save(existing);
        }
        return null;
    }

    @Override
    public List<Goal> getGoalsByUser(int uid) {
        User u = userRepository.findById(uid).orElse(null);
        if (u == null) return List.of();
        return goalRepository.findByUser(u);
    }

    @Override
    public String deleteGoal(int gid) {
        if (goalRepository.existsById(gid)) {
            goalRepository.deleteById(gid);
            return "Goal Deleted";
        }
        return "Goal Not Found";
    }
}

// GoalService.java
package com.bps.service;
import java.util.List;
import com.bps.model.Goal;

public interface GoalService {
    Goal createGoal(Goal g);
    Goal updateGoal(Goal g);
    List<Goal> getGoalsByUser(int uid);
    String deleteGoal(int gid);
}

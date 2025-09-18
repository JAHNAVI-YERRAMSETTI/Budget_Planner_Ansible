package com.bps.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "budgetgoal")
public class BudgetGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String goalname;
    private double amountGoal;

    @Temporal(TemporalType.DATE)
    private Date targetDate;

    private int userid;

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getGoalname() { return goalname; }
    public void setGoalname(String goalname) { this.goalname = goalname; }

    public double getAmountGoal() { return amountGoal; }
    public void setAmountGoal(double amountGoal) { this.amountGoal = amountGoal; }

    public Date getTargetDate() { return targetDate; }
    public void setTargetDate(Date targetDate) { this.targetDate = targetDate; }

    public int getUserid() { return userid; }
    public void setUserid(int userid) { this.userid = userid; }
}

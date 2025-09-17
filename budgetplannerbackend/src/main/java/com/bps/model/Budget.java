package com.bps.model;

import jakarta.persistence.*;

@Entity

public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String category;
    private double amount;

    @ManyToOne
    private User user;
}

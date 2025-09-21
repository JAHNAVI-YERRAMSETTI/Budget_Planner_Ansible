package com.bps.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.List;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class Retailer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String defaultCategory;
    @OneToMany(mappedBy = "retailer")
    private List<Transaction> transactions;

    public Retailer() {}

    // JsonCreator for deserialization from ID stub {id: X}
    @JsonCreator
    public Retailer(@JsonProperty("id") Long id) {
        this.id = id;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDefaultCategory() { return defaultCategory; }
    public void setDefaultCategory(String defaultCategory) { this.defaultCategory = defaultCategory; }
    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }
}
package com.bps.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonBackReference(value = "user-transaction")
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    @JsonBackReference(value = "category-transaction")
    private Category category;

    private double amount;
    private LocalDate date;
    private boolean isPaymentAppImport;
    private String retailer;
    private String suggestedCategory;
    private boolean isUserConfirmedCategory;

    public Transaction() {}

    // JsonCreator for deserialization from ID stub {id: X}
    @JsonCreator
    public Transaction(@JsonProperty("id") Long id) {
        this.id = id;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public boolean isPaymentAppImport() { return isPaymentAppImport; }
    public void setPaymentAppImport(boolean paymentAppImport) { this.isPaymentAppImport = paymentAppImport; }
    public String getRetailer() { return retailer; }
    public void setRetailer(String retailer) { this.retailer = retailer; }
    public String getSuggestedCategory() { return suggestedCategory; }
    public void setSuggestedCategory(String suggestedCategory) { this.suggestedCategory = suggestedCategory; }
    public boolean isUserConfirmedCategory() { return isUserConfirmedCategory; }
    public void setUserConfirmedCategory(boolean userConfirmedCategory) { this.isUserConfirmedCategory = userConfirmedCategory; }
}
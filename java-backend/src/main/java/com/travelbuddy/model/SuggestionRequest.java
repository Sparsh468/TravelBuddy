package com.travelbuddy.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class SuggestionRequest {
    @JsonProperty("budget_inr")
    @Min(value = 1000, message = "Budget must be at least ₹1,000")
    private int budgetInr;
    
    @Min(value = 1, message = "Nights must be at least 1")
    @Max(value = 30, message = "Nights cannot exceed 30")
    private int nights;

    // Default constructor
    public SuggestionRequest() {}

    // Constructor with all fields
    public SuggestionRequest(int budgetInr, int nights) {
        this.budgetInr = budgetInr;
        this.nights = nights;
    }

    // Getters and Setters
    public int getBudgetInr() {
        return budgetInr;
    }

    public void setBudgetInr(int budgetInr) {
        this.budgetInr = budgetInr;
    }

    public int getNights() {
        return nights;
    }

    public void setNights(int nights) {
        this.nights = nights;
    }

    @Override
    public String toString() {
        return "SuggestionRequest{" +
                "budgetInr=" + budgetInr +
                ", nights=" + nights +
                '}';
    }
}


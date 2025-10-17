package com.travelbuddy.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DayPlan {
    private String title;
    private String note;
    
    @JsonProperty("est_spend_inr")
    private int estSpendInr;

    // Default constructor
    public DayPlan() {}

    // Constructor with all fields
    public DayPlan(String title, String note, int estSpendInr) {
        this.title = title;
        this.note = note;
        this.estSpendInr = estSpendInr;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public int getEstSpendInr() {
        return estSpendInr;
    }

    public void setEstSpendInr(int estSpendInr) {
        this.estSpendInr = estSpendInr;
    }

    @Override
    public String toString() {
        return "DayPlan{" +
                "title='" + title + '\'' +
                ", note='" + note + '\'' +
                ", estSpendInr=" + estSpendInr +
                '}';
    }
}


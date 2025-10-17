package com.travelbuddy.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Destination {
    private String id;
    private String name;
    private String state;
    private String theme;
    private String image;
    private int budgetBaseCost;
    private int balancedBaseCost;
    private int luxuryBaseCost;

    // Default constructor
    public Destination() {}

    // Constructor with all fields
    public Destination(String id, String name, String state, String theme, String image,
                      int budgetBaseCost, int balancedBaseCost, int luxuryBaseCost) {
        this.id = id;
        this.name = name;
        this.state = state;
        this.theme = theme;
        this.image = image;
        this.budgetBaseCost = budgetBaseCost;
        this.balancedBaseCost = balancedBaseCost;
        this.luxuryBaseCost = luxuryBaseCost;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @JsonProperty("budget_base_cost")
    public int getBudgetBaseCost() {
        return budgetBaseCost;
    }

    public void setBudgetBaseCost(int budgetBaseCost) {
        this.budgetBaseCost = budgetBaseCost;
    }

    @JsonProperty("balanced_base_cost")
    public int getBalancedBaseCost() {
        return balancedBaseCost;
    }

    public void setBalancedBaseCost(int balancedBaseCost) {
        this.balancedBaseCost = balancedBaseCost;
    }

    @JsonProperty("luxury_base_cost")
    public int getLuxuryBaseCost() {
        return luxuryBaseCost;
    }

    public void setLuxuryBaseCost(int luxuryBaseCost) {
        this.luxuryBaseCost = luxuryBaseCost;
    }

    public int getBaseCostForTier(String tier) {
        switch (tier.toLowerCase()) {
            case "budget":
                return budgetBaseCost;
            case "balanced":
                return balancedBaseCost;
            case "luxury":
                return luxuryBaseCost;
            default:
                return balancedBaseCost;
        }
    }

    @Override
    public String toString() {
        return "Destination{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", state='" + state + '\'' +
                ", theme='" + theme + '\'' +
                ", image='" + image + '\'' +
                ", budgetBaseCost=" + budgetBaseCost +
                ", balancedBaseCost=" + balancedBaseCost +
                ", luxuryBaseCost=" + luxuryBaseCost +
                '}';
    }
}


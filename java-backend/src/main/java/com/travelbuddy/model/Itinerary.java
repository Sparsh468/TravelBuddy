package com.travelbuddy.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class Itinerary {
    private String id;
    private String name;
    private String state;
    private String theme;
    private String image;
    private String tier;
    
    @JsonProperty("per_night_inr")
    private int perNightInr;
    
    @JsonProperty("total_inr")
    private int totalInr;
    
    private List<Hotel> hotels;
    private List<DayPlan> days;

    // Default constructor
    public Itinerary() {}

    // Constructor with all fields
    public Itinerary(String id, String name, String state, String theme, String image,
                     String tier, int perNightInr, int totalInr, List<Hotel> hotels, List<DayPlan> days) {
        this.id = id;
        this.name = name;
        this.state = state;
        this.theme = theme;
        this.image = image;
        this.tier = tier;
        this.perNightInr = perNightInr;
        this.totalInr = totalInr;
        this.hotels = hotels;
        this.days = days;
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

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public int getPerNightInr() {
        return perNightInr;
    }

    public void setPerNightInr(int perNightInr) {
        this.perNightInr = perNightInr;
    }

    public int getTotalInr() {
        return totalInr;
    }

    public void setTotalInr(int totalInr) {
        this.totalInr = totalInr;
    }

    public List<Hotel> getHotels() {
        return hotels;
    }

    public void setHotels(List<Hotel> hotels) {
        this.hotels = hotels;
    }

    public List<DayPlan> getDays() {
        return days;
    }

    public void setDays(List<DayPlan> days) {
        this.days = days;
    }

    @Override
    public String toString() {
        return "Itinerary{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", state='" + state + '\'' +
                ", theme='" + theme + '\'' +
                ", image='" + image + '\'' +
                ", tier='" + tier + '\'' +
                ", perNightInr=" + perNightInr +
                ", totalInr=" + totalInr +
                ", hotels=" + hotels +
                ", days=" + days +
                '}';
    }
}


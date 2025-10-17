package com.travelbuddy.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Hotel {
    private String name;
    private String note;

    // Default constructor
    public Hotel() {}

    // Constructor with all fields
    public Hotel(String name, String note) {
        this.name = name;
        this.note = note;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    @Override
    public String toString() {
        return "Hotel{" +
                "name='" + name + '\'' +
                ", note='" + note + '\'' +
                '}';
    }
}


package com.travelbuddy.service;

import com.travelbuddy.model.*;
import com.travelbuddy.repository.DestinationRepository;
import com.travelbuddy.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ItineraryService {

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private HotelRepository hotelRepository;

    /**
     * Simple method to determine travel tier based on budget
     * Budget: < 60,000
     * Balanced: 60,000 to 99,999
     * Luxury: >= 1,00,000
     */
    public String determineTier(int budgetInr) {
        if (budgetInr < 60000) {
            return "budget";
        } else if (budgetInr < 100000) {
            return "balanced";
        } else {
            return "luxury";
        }
    }

    /**
     * Simple method to get base cost per night based on tier
     */
    public int getBaseCostPerNight(String tier) {
        if ("budget".equals(tier)) {
            return 2000;
        } else if ("balanced".equals(tier)) {
            return 3500;
        } else {
            return 8000;
        }
    }

    /**
     * Simple method to generate travel itineraries
     * This method uses JDBC to fetch data from database
     */
    public List<Itinerary> generateItineraries(int budgetInr, int nights) {
        // Step 1: Determine travel tier based on budget
        String tier = determineTier(budgetInr);
        
        // Step 2: Get base cost per night for this tier
        int baseCostPerNight = getBaseCostPerNight(tier);
        
        // Step 3: Fetch destinations from database using JDBC
        List<Destination> destinations = destinationRepository.findAll();
        List<Itinerary> itineraries = new ArrayList<>();

        // Step 4: Create itinerary for each destination
        for (Destination dest : destinations) {
            // Calculate total cost
            int totalCost = baseCostPerNight * nights;
            
            // Get hotels from database using JDBC
            List<Hotel> hotels = hotelRepository.findByDestinationIdAndTier(dest.getId(), tier);
            
            // Create simple day plans
            List<DayPlan> dayPlans = createSimpleDayPlans(nights, totalCost / nights);

            // Create itinerary object
            Itinerary itinerary = new Itinerary(
                dest.getId(),
                dest.getName(),
                dest.getState(),
                dest.getTheme(),
                dest.getImage(),
                tier,
                baseCostPerNight,
                totalCost,
                hotels,
                dayPlans
            );

            itineraries.add(itinerary);
        }
        
        return itineraries;
    }

    /**
     * Simple method to create day plans
     * This is a basic implementation for demonstration
     */
    private List<DayPlan> createSimpleDayPlans(int nights, int costPerDay) {
        List<DayPlan> dayPlans = new ArrayList<>();
        
        String[] activities = {
            "Visit local attractions",
            "Explore historical sites", 
            "Enjoy local cuisine",
            "Relax and unwind"
        };
        
        for (int i = 0; i < nights; i++) {
            String activity = activities[i % activities.length];
            DayPlan dayPlan = new DayPlan(
                "Day " + (i + 1) + ": " + activity,
                "Enjoy your trip",
                costPerDay
            );
            dayPlans.add(dayPlan);
        }
        
        return dayPlans;
    }
}

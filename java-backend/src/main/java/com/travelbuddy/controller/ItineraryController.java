package com.travelbuddy.controller;

import com.travelbuddy.model.Itinerary;
import com.travelbuddy.model.SuggestionRequest;
import com.travelbuddy.service.ItineraryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow CORS for frontend integration
public class ItineraryController {

    @Autowired
    private ItineraryService itineraryService;

    /**
     * Generate travel itinerary suggestions based on budget and number of nights
     */
    @PostMapping("/suggest")
    public ResponseEntity<List<Itinerary>> suggestItineraries(@Valid @RequestBody SuggestionRequest request) {
        try {
            List<Itinerary> itineraries = itineraryService.generateItineraries(request.getBudgetInr(), request.getNights());
            return ResponseEntity.ok(itineraries);
        } catch (Exception e) {
            // Log the error (in production, use proper logging framework)
            System.err.println("Error generating itineraries: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("TravelBuddy Backend is running!");
    }

    /**
     * Get basic application info
     */
    @GetMapping("/info")
    public ResponseEntity<Object> getInfo() {
        return ResponseEntity.ok(new Object() {
            public final String name = "TravelBuddy Backend";
            public final String version = "1.0.0";
            public final String description = "Travel itinerary backend with JDBC";
        });
    }
}



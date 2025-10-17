# TravelBuddy - College Project Documentation

## Project Overview
**TravelBuddy** is a web application that helps users plan their travel in India based on their budget. It demonstrates the use of **SQL**, **Java**, and **JDBC** technologies.

## Technologies Used
1. **Frontend**: HTML, CSS, JavaScript
2. **Backend**: Java with Spring Boot
3. **Database**: H2 Database (SQL)
4. **Database Connectivity**: JDBC

## Project Structure

### Frontend Files
- `index-simple.html` - Main webpage (use this for presentation)
- `app-simple.js` - Simplified JavaScript code
- `styles.css` - CSS styling
- `logo.png` - Application logo
- `*.jpeg` - Destination images

### Backend Files (Java)
- `BackendApplication.java` - Main Spring Boot application
- `ItineraryController.java` - REST API controller
- `ItineraryService.java` - Business logic service
- `Destination.java`, `Hotel.java`, `DayPlan.java` - Data models
- `DestinationRepository.java`, `HotelRepository.java` - JDBC repositories

### Database Files (SQL)
- `application.yml` - Database configuration
- `schema.sql` - Database table structure
- `data.sql` - Sample data (5 destinations)

## Key Features

### 1. Budget-Based Travel Tiers
- **Budget**: Less than ₹60,000
- **Balanced**: ₹60,000 to ₹99,999
- **Luxury**: ₹1,00,000 and above

### 2. Database Tables
```sql
-- Destinations table
destinations (id, name, state, theme, image, budget_base_cost, balanced_base_cost, luxury_base_cost)

-- Hotels table  
hotels (id, destination_id, tier, name, note)
```

### 3. API Endpoints
- `POST /api/suggest` - Get travel suggestions
- `GET /api/health` - Health check

## How to Run the Project

### 1. Start Backend (Java)
```bash
cd java-backend
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

### 2. Open Frontend
Open `index-simple.html` in web browser

### 3. Test the Application
1. Enter budget (e.g., 50000)
2. Enter number of nights (e.g., 5)
3. Click "Get Travel Suggestions"
4. View results

## Database Access
- **H2 Console**: http://localhost:8080/h2-console
- **JDBC URL**: `jdbc:h2:mem:travelbuddy`
- **Username**: `sa`
- **Password**: (leave empty)

## Viva Questions & Answers

### Q1: What is JDBC?
**A**: JDBC (Java Database Connectivity) is a Java API that allows Java programs to interact with databases. It provides methods to query and update data in a database.

### Q2: How do you connect to database in this project?
**A**: Using H2 in-memory database with JDBC driver. Configuration is in `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:travelbuddy
    driver-class-name: org.h2.Driver
```

### Q3: What SQL queries are used?
**A**: 
- `SELECT * FROM destinations` - Get all destinations
- `SELECT * FROM hotels WHERE destination_id = ? AND tier = ?` - Get hotels for specific destination and tier

### Q4: How does the application determine travel tier?
**A**: Based on budget using simple if-else logic:
```java
if (budget < 60000) return "budget";
else if (budget < 100000) return "balanced";
else return "luxury";
```

### Q5: What design patterns are used?
**A**: 
- **Repository Pattern**: `DestinationRepository`, `HotelRepository`
- **Service Layer Pattern**: `ItineraryService`
- **Model-View-Controller**: Controller, Service, Model classes

## Key Learning Points
1. **JDBC**: Database connectivity in Java
2. **SQL**: Database queries and table structure
3. **Spring Boot**: Framework for Java web applications
4. **REST API**: Communication between frontend and backend
5. **Database Design**: Tables, relationships, and data modeling

## Files for Presentation
- Use `index-simple.html` for frontend demo
- Show `ItineraryService.java` for business logic
- Show `schema.sql` and `data.sql` for database
- Show `application.yml` for configuration

## Troubleshooting
- If backend doesn't start: Check if port 8080 is free
- If frontend doesn't work: Open browser console for errors
- If database issues: Check H2 console at http://localhost:8080/h2-console

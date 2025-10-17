# TravelBuddy - College Project

A simple web application for travel planning in India using **SQL**, **Java**, and **JDBC**.

## Quick Start

### 1. Run Backend
```bash
cd java-backend
mvn spring-boot:run
```

### 2. Open Frontend
Open `index-simple.html` in your web browser

### 3. Test Application
- Enter budget (e.g., 50000)
- Enter nights (e.g., 5) 
- Click "Get Travel Suggestions"

## Technologies
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Java + Spring Boot
- **Database**: H2 (SQL)
- **Connectivity**: JDBC

## Key Files
- `index-simple.html` - Main webpage
- `app-simple.js` - Frontend logic
- `ItineraryService.java` - Business logic
- `schema.sql` - Database structure
- `data.sql` - Sample data

## Database Access
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:travelbuddy`
- Username: `sa`
- Password: (empty)

## For College Presentation
1. Show the simple HTML page
2. Explain the Java backend code
3. Demonstrate database queries
4. Show JDBC connectivity

See `PROJECT_DOCUMENTATION.md` for detailed information.

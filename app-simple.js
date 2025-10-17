// Simple TravelBuddy Frontend - Easy to understand for college project
// This file demonstrates basic JavaScript concepts

// Simple function to format Indian currency
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Simple function to determine travel tier based on budget
function getTravelTier(budget) {
    if (budget < 60000) {
        return 'budget';
    } else if (budget < 100000) {
        return 'balanced';
    } else {
        return 'luxury';
    }
}

// Simple function to calculate cost per night
function calculateCostPerNight(tier, nights) {
    let baseCost;
    switch (tier) {
        case 'budget':
            baseCost = 2000;
            break;
        case 'balanced':
            baseCost = 3500;
            break;
        case 'luxury':
            baseCost = 8000;
            break;
        default:
            baseCost = 3500;
    }
    return baseCost;
}

// Simple destinations data (matching backend)
const destinations = [
    { id: 'goa', name: 'Goa', state: 'Goa', theme: 'Beaches & nightlife', image: 'goa.jpeg' },
    { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', theme: 'Palaces & culture', image: 'jaipur.jpeg' },
    { id: 'manali', name: 'Manali', state: 'Himachal Pradesh', theme: 'Mountains & adventure', image: 'manali.jpeg' },
    { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', theme: 'City & seafronts', image: 'mumbai.jpeg' },
    { id: 'kerala', name: 'Kochi', state: 'Kerala', theme: 'Backwaters & culture', image: 'kochi.jpeg' }
];

// Simple function to create itinerary card HTML
function createItineraryCard(destination, tier, nights) {
    const costPerNight = calculateCostPerNight(tier, nights);
    const totalCost = costPerNight * nights;
    
    return `
        <div class="card">
            <img src="${destination.image}" alt="${destination.name}" />
            <div class="content">
                <h3>${destination.name}</h3>
                <p>${destination.state} • ${destination.theme}</p>
                <p><strong>Tier:</strong> ${tier}</p>
                <p><strong>Cost per night:</strong> ${formatCurrency(costPerNight)}</p>
                <p><strong>Total for ${nights} nights:</strong> ${formatCurrency(totalCost)}</p>
            </div>
        </div>
    `;
}

// Main function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const budgetInput = document.getElementById('budget');
    const nightsInput = document.getElementById('nights');
    
    const budget = parseInt(budgetInput.value);
    const nights = parseInt(nightsInput.value);
    
    // Validate inputs
    if (!budget || budget < 1000) {
        alert('Please enter a valid budget (minimum ₹1,000)');
        return;
    }
    
    if (!nights || nights < 1) {
        alert('Please enter valid number of nights (minimum 1)');
        return;
    }
    
    // Determine travel tier
    const tier = getTravelTier(budget);
    
    // Show results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Travel Suggestions</h2>';
    resultsDiv.innerHTML += `<p>Your budget: ${formatCurrency(budget)} | Nights: ${nights} | Tier: ${tier}</p>`;
    
    // Generate suggestions for each destination
    destinations.forEach(destination => {
        const card = createItineraryCard(destination, tier, nights);
        resultsDiv.innerHTML += card;
    });
    
    // Try to fetch from backend (optional)
    fetchFromBackend(budget, nights);
}

// Simple function to fetch data from Java backend
async function fetchFromBackend(budget, nights) {
    try {
        const response = await fetch('http://localhost:8080/api/suggest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                budget_inr: budget,
                nights: nights
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Backend response:', data);
            // You can process backend data here if needed
        }
    } catch (error) {
        console.log('Backend not available, using frontend calculations');
    }
}

// Initialize the application when page loads
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('trip-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    console.log('TravelBuddy application initialized');
});

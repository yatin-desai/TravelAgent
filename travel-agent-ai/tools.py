from datetime import datetime

def calculate_layover(arrival_str, departure_str):
    # Converts API time strings into Python objects we can subtract
    fmt = "%Y-%m-%dT%H:%M:%S"
    arrival = datetime.strptime(arrival_str, fmt)
    departure = datetime.strptime(departure_str, fmt)
    
    # Calculate difference in minutes
    duration = departure - arrival
    return duration.total_seconds() / 60

def filter_flights_by_layover(raw_flights):
    valid_flights = []
    min_layover = 150  # 2.5 hours in minutes

    for flight in raw_flights:
        itinerary = flight['itineraries'][0]
        segments = itinerary['segments']
        
        # If direct flight, it passes!
        if len(segments) == 1:
            valid_flights.append(flight)
            continue
            
        # Check all layovers in the journey
        all_layovers_valid = True
        for i in range(len(segments) - 1):
            arrival_time = segments[i]['arrival']['at']
            departure_time = segments[i+1]['departure']['at']
            
            layover_time = calculate_layover(arrival_time, departure_time)
            
            if layover_time < min_layover:
                all_layovers_valid = False
                break
        
        if all_layovers_valid:
            valid_flights.append(flight)
            
    return valid_flights


import os
from datetime import datetime
from amadeus import Client, ResponseError
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()

# Initialize Amadeus Client
amadeus = Client(
    client_id=os.getenv("AMADEUS_CLIENT_ID"),
    client_secret=os.getenv("AMADEUS_CLIENT_SECRET")
)

def calculate_layover(arrival_str, departure_str):
    fmt = "%Y-%m-%dT%H:%M:%S"
    arrival = datetime.strptime(arrival_str, fmt)
    departure = datetime.strptime(departure_str, fmt)
    return (departure - arrival).total_seconds() / 60

@tool
def search_flights_tool(origin: str, destination: str, departure_date: str):
    """
    Searches for flights and filters them by a minimum 2.5-hour layover rule.
    Args:
        origin: 3-letter IATA code (e.g., 'JFK')
        destination: 3-letter IATA code (e.g., 'LHR')
        departure_date: Date in YYYY-MM-DD format
    """
    try:
        # 1. Fetch flight offers from Amadeus
        response = amadeus.shopping.flight_offers_search.get(
            originLocationCode=origin,
            destinationLocationCode=destination,
            departureDate=departure_date,
            adults=1,
            max=10  # Get top 10 cheapest to analyze
        )
        
        raw_flights = response.data
        valid_flights = []

        # 2. Apply your comfort logic (2.5 hr layover)
        for flight in raw_flights:
            itineraries = flight['itineraries'][0]
            segments = itineraries['segments']
            
            # Direct flights are always valid
            if len(segments) == 1:
                valid_flights.append(flight)
                continue

            # Check every layover in the journey
            is_valid = True
            for i in range(len(segments) - 1):
                arrival = segments[i]['arrival']['at']
                next_departure = segments[i+1]['departure']['at']
                
                if calculate_layover(arrival, next_departure) < 150:
                    is_valid = False
                    break
            
            if is_valid:
                valid_flights.append({
                    "price": flight['price']['total'],
                    "currency": flight['price']['currency'],
                    "stops": len(segments) - 1,
                    "airline": flight['validatingAirlineCodes'][0]
                })

        return valid_flights if valid_flights else "No flights found with a 2.5hr layover."

    except ResponseError as error:
        return f"Error fetching flights: {error}"
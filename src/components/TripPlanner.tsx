import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Users, Baby, DollarSign, Clock, ExternalLink, Plane, Hotel, Compass, Utensils } from 'lucide-react';
import { 
  MockFlight, 
  MockHotel, 
  MockAttraction, 
  MockRestaurant,
  generateMockFlights, 
  generateMockHotels, 
  generateMockAttractions,
  generateMockRestaurants 
} from '@/lib/mock-travel-data';
import { Trip } from '@/hooks/useTrips';

interface TripPlannerProps {
  trip: Trip;
}

export function TripPlanner({ trip }: TripPlannerProps) {
  const [selectedTab, setSelectedTab] = useState('flights');
  
  const flights = generateMockFlights(trip.destination, trip.departure_date);
  const hotels = generateMockHotels(trip.destination);
  const attractions = generateMockAttractions(trip.destination);
  const restaurants = generateMockRestaurants(trip.destination);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Trip Planning: {trip.name}</h2>
        <p className="text-muted-foreground">
          {trip.destination} • {new Date(trip.departure_date).toLocaleDateString()}
          {trip.return_date && ` - ${new Date(trip.return_date).toLocaleDateString()}`}
        </p>
        <Badge variant="outline" className="mt-2">Demo Mode - Real APIs coming soon</Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="flights">
            <Plane className="h-4 w-4 mr-2" />
            Flights
          </TabsTrigger>
          <TabsTrigger value="hotels">
            <Hotel className="h-4 w-4 mr-2" />
            Hotels
          </TabsTrigger>
          <TabsTrigger value="attractions">
            <Compass className="h-4 w-4 mr-2" />
            Things to Do
          </TabsTrigger>
          <TabsTrigger value="dining">
            <Utensils className="h-4 w-4 mr-2" />
            Dining
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flights" className="space-y-4 mt-4">
          <FlightResults flights={flights} />
        </TabsContent>

        <TabsContent value="hotels" className="space-y-4 mt-4">
          <HotelResults hotels={hotels} />
        </TabsContent>

        <TabsContent value="attractions" className="space-y-4 mt-4">
          <AttractionResults attractions={attractions} />
        </TabsContent>

        <TabsContent value="dining" className="space-y-4 mt-4">
          <RestaurantResults restaurants={restaurants} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FlightResults({ flights }: { flights: MockFlight[] }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Showing {flights.length} flights • Prices are per person
      </p>
      {flights.map((flight) => (
        <Card key={flight.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-semibold">{flight.airline}</span>
                  <span className="text-sm text-muted-foreground">{flight.flightNumber}</span>
                  {flight.stops === 0 && <Badge variant="secondary">Nonstop</Badge>}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-semibold text-lg">{flight.departure.time}</p>
                    <p className="text-sm text-muted-foreground">{flight.departure.airport}</p>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="h-px bg-border flex-1" />
                    <span className="text-xs text-muted-foreground">{flight.duration}</span>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg">{flight.arrival.time}</p>
                    <p className="text-sm text-muted-foreground">{flight.arrival.airport}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <p className="text-2xl font-bold text-primary">${flight.price}</p>
                <p className="text-xs text-muted-foreground">{flight.seatsLeft} seats left</p>
                <Button size="sm" className="mt-2" disabled>
                  Select
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function HotelResults({ hotels }: { hotels: MockHotel[] }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Showing {hotels.length} hotels with group rates available
      </p>
      {hotels.map((hotel) => (
        <Card key={hotel.id}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                <Hotel className="h-8 w-8 text-muted-foreground" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{hotel.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1">{hotel.rating}</span>
                      </div>
                      <span className="text-muted-foreground">({hotel.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${hotel.pricePerNight}</p>
                    <p className="text-xs text-muted-foreground">per night</p>
                    {hotel.teamDiscount && (
                      <Badge variant="secondary" className="mt-1">
                        {hotel.teamDiscount}% team discount
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{hotel.distanceFromVenue} from venue</span>
                  {hotel.familyFriendly && (
                    <>
                      <span className="mx-1">•</span>
                      <Users className="h-4 w-4" />
                      <span>Family Friendly</span>
                    </>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {hotel.amenities.slice(0, 4).map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AttractionResults({ attractions }: { attractions: MockAttraction[] }) {
  const [ageFilter, setAgeFilter] = useState<string>('all');
  
  const filteredAttractions = ageFilter === 'all' 
    ? attractions 
    : attractions.filter(a => a.ageGroups.includes(ageFilter) || a.ageGroups.includes('all'));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium">Filter by age group:</span>
        {['all', 'U8', 'U10', 'U12', 'U14', 'U16', 'U18'].map((age) => (
          <Badge 
            key={age}
            variant={ageFilter === age ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setAgeFilter(age)}
          >
            {age === 'all' ? 'All Ages' : age}
          </Badge>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {filteredAttractions.map((attraction) => (
          <Card key={attraction.id}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <Compass className="h-6 w-6 text-muted-foreground" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{attraction.name}</h3>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {attraction.category}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm">{attraction.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {attraction.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {attraction.priceRange}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {attraction.duration}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {attraction.ageGroups.filter(a => a !== 'all').slice(0, 3).map((age) => (
                      <Badge key={age} variant="outline" className="text-xs">
                        {age}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RestaurantResults({ restaurants }: { restaurants: MockRestaurant[] }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Group-friendly restaurants near the venue
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{restaurant.name}</h3>
                  <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{restaurant.priceRange}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm">{restaurant.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{restaurant.address}</span>
              </div>
              
              <div className="flex gap-2 mt-2">
                {restaurant.groupFriendly && (
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    Groups Welcome
                  </Badge>
                )}
                {restaurant.kidsMenu && (
                  <Badge variant="outline" className="text-xs">
                    <Baby className="h-3 w-3 mr-1" />
                    Kids Menu
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

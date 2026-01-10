// Mock data for travel planning demo

export interface MockFlight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
  };
  duration: string;
  price: number;
  stops: number;
  seatsLeft: number;
}

export interface MockHotel {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  amenities: string[];
  distanceFromVenue: string;
  imageUrl: string;
  familyFriendly: boolean;
  teamDiscount?: number;
}

export interface MockAttraction {
  id: string;
  name: string;
  category: string;
  description: string;
  ageGroups: string[];
  priceRange: string;
  rating: number;
  duration: string;
  address: string;
  imageUrl: string;
}

export interface MockRestaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  groupFriendly: boolean;
  kidsMenu: boolean;
  address: string;
}

export function generateMockFlights(destination: string, departureDate: string): MockFlight[] {
  const airlines = ['United', 'Delta', 'American', 'Southwest', 'JetBlue'];
  const flights: MockFlight[] = [];

  for (let i = 0; i < 6; i++) {
    const airline = airlines[i % airlines.length];
    const basePrice = 150 + Math.floor(Math.random() * 200);
    const departHour = 6 + (i * 2);
    const flightDuration = 2 + Math.floor(Math.random() * 3);

    flights.push({
      id: `FL-${i + 1}`,
      airline,
      flightNumber: `${airline.substring(0, 2).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`,
      departure: {
        airport: 'SFO',
        city: 'San Francisco',
        time: `${String(departHour).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
      },
      arrival: {
        airport: destination.substring(0, 3).toUpperCase(),
        city: destination,
        time: `${String(departHour + flightDuration).padStart(2, '0')}:${i % 2 === 0 ? '15' : '45'}`,
      },
      duration: `${flightDuration}h ${15 + (i * 10) % 45}m`,
      price: basePrice + (i % 3 === 0 ? 0 : i % 2 === 0 ? -30 : 50),
      stops: i < 3 ? 0 : 1,
      seatsLeft: 2 + Math.floor(Math.random() * 8),
    });
  }

  return flights.sort((a, b) => a.price - b.price);
}

export function generateMockHotels(destination: string): MockHotel[] {
  const hotels: MockHotel[] = [
    {
      id: 'HTL-1',
      name: 'Grand Sports Resort',
      rating: 4.5,
      reviews: 234,
      pricePerNight: 159,
      amenities: ['Pool', 'Free Breakfast', 'Gym', 'Free Parking', 'Suite Rooms'],
      distanceFromVenue: '0.5 miles',
      imageUrl: '/placeholder.svg',
      familyFriendly: true,
      teamDiscount: 15,
    },
    {
      id: 'HTL-2',
      name: 'Family Inn & Suites',
      rating: 4.2,
      reviews: 456,
      pricePerNight: 129,
      amenities: ['Pool', 'Free Breakfast', 'Kids Play Area', 'Free Parking'],
      distanceFromVenue: '1.2 miles',
      imageUrl: '/placeholder.svg',
      familyFriendly: true,
      teamDiscount: 10,
    },
    {
      id: 'HTL-3',
      name: `${destination} Plaza Hotel`,
      rating: 4.7,
      reviews: 892,
      pricePerNight: 219,
      amenities: ['Pool', 'Spa', 'Restaurant', 'Room Service', 'Concierge'],
      distanceFromVenue: '0.3 miles',
      imageUrl: '/placeholder.svg',
      familyFriendly: true,
    },
    {
      id: 'HTL-4',
      name: 'Budget Stay Express',
      rating: 3.8,
      reviews: 567,
      pricePerNight: 89,
      amenities: ['Free Wifi', 'Free Parking', 'Continental Breakfast'],
      distanceFromVenue: '2.5 miles',
      imageUrl: '/placeholder.svg',
      familyFriendly: true,
    },
    {
      id: 'HTL-5',
      name: 'Courtyard Athletic Center',
      rating: 4.3,
      reviews: 345,
      pricePerNight: 149,
      amenities: ['Pool', 'Gym', 'Free Breakfast', 'Meeting Rooms', 'Team Rates'],
      distanceFromVenue: '0.8 miles',
      imageUrl: '/placeholder.svg',
      familyFriendly: true,
      teamDiscount: 20,
    },
  ];

  return hotels;
}

export function generateMockAttractions(destination: string): MockAttraction[] {
  return [
    {
      id: 'ATT-1',
      name: `${destination} Science Center`,
      category: 'Museum',
      description: 'Interactive science exhibits perfect for curious young minds. Features hands-on activities and special exhibits.',
      ageGroups: ['U8', 'U10', 'U12', 'U14', 'all'],
      priceRange: '$15-25',
      rating: 4.6,
      duration: '2-3 hours',
      address: '123 Discovery Way',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 'ATT-2',
      name: 'Adventure Zone Theme Park',
      category: 'Amusement Park',
      description: 'Thrilling rides and attractions for teens. Includes water park section and go-karts.',
      ageGroups: ['U14', 'U16', 'U18', 'all'],
      priceRange: '$45-65',
      rating: 4.4,
      duration: '4-6 hours',
      address: '500 Fun Blvd',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 'ATT-3',
      name: 'Mini Golf & Games Center',
      category: 'Entertainment',
      description: 'Family-friendly entertainment with mini golf, arcade games, and laser tag.',
      ageGroups: ['U8', 'U10', 'U12', 'U14', 'all'],
      priceRange: '$12-20',
      rating: 4.3,
      duration: '1-2 hours',
      address: '789 Game Street',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 'ATT-4',
      name: 'Sports Hall of Fame',
      category: 'Museum',
      description: 'Celebrate sports history with interactive exhibits and memorabilia from legendary athletes.',
      ageGroups: ['U10', 'U12', 'U14', 'U16', 'U18', 'all'],
      priceRange: '$10-18',
      rating: 4.5,
      duration: '1-2 hours',
      address: '456 Champions Drive',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 'ATT-5',
      name: 'Trampoline & Adventure Park',
      category: 'Active Play',
      description: 'High-energy fun with trampolines, ninja courses, and foam pits. Great for team bonding!',
      ageGroups: ['U8', 'U10', 'U12', 'U14', 'U16', 'all'],
      priceRange: '$18-28',
      rating: 4.4,
      duration: '2-3 hours',
      address: '321 Bounce Ave',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 'ATT-6',
      name: 'City Zoo & Aquarium',
      category: 'Zoo',
      description: 'See amazing animals from around the world. Features feeding experiences and shows.',
      ageGroups: ['U8', 'U10', 'U12', 'all'],
      priceRange: '$20-35',
      rating: 4.7,
      duration: '3-4 hours',
      address: '100 Wildlife Way',
      imageUrl: '/placeholder.svg',
    },
  ];
}

export function generateMockRestaurants(destination: string): MockRestaurant[] {
  return [
    {
      id: 'RST-1',
      name: 'Team Spirit Sports Grill',
      cuisine: 'American',
      priceRange: '$$',
      rating: 4.3,
      groupFriendly: true,
      kidsMenu: true,
      address: '123 Main St',
    },
    {
      id: 'RST-2',
      name: 'Pasta Palace',
      cuisine: 'Italian',
      priceRange: '$$',
      rating: 4.5,
      groupFriendly: true,
      kidsMenu: true,
      address: '456 Oak Ave',
    },
    {
      id: 'RST-3',
      name: 'Champion Burger Co.',
      cuisine: 'Burgers',
      priceRange: '$',
      rating: 4.2,
      groupFriendly: true,
      kidsMenu: true,
      address: '789 Burger Lane',
    },
    {
      id: 'RST-4',
      name: 'Tokyo Express',
      cuisine: 'Japanese',
      priceRange: '$$',
      rating: 4.4,
      groupFriendly: true,
      kidsMenu: true,
      address: '321 Sushi Blvd',
    },
    {
      id: 'RST-5',
      name: 'Pizza Stadium',
      cuisine: 'Pizza',
      priceRange: '$',
      rating: 4.1,
      groupFriendly: true,
      kidsMenu: true,
      address: '555 Slice St',
    },
  ];
}

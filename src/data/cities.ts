export type City = {
  city: string;
  country: string;
  lat: number;
  lon: number;
};

export const CITIES: City[] = [
  // North America
  { city: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { city: 'Los Angeles', country: 'United States', lat: 34.0522, lon: -118.2437 },
  { city: 'Chicago', country: 'United States', lat: 41.8781, lon: -87.6298 },
  { city: 'Houston', country: 'United States', lat: 29.7604, lon: -95.3698 },
  { city: 'Phoenix', country: 'United States', lat: 33.4484, lon: -112.074 },
  { city: 'Philadelphia', country: 'United States', lat: 39.9526, lon: -75.1652 },
  { city: 'San Antonio', country: 'United States', lat: 29.4241, lon: -98.4936 },
  { city: 'San Diego', country: 'United States', lat: 32.7157, lon: -117.1611 },
  { city: 'Dallas', country: 'United States', lat: 32.7767, lon: -96.797 },
  { city: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194 },
  { city: 'Seattle', country: 'United States', lat: 47.6062, lon: -122.3321 },
  { city: 'Denver', country: 'United States', lat: 39.7392, lon: -104.9903 },
  { city: 'Boston', country: 'United States', lat: 42.3601, lon: -71.0589 },
  { city: 'Miami', country: 'United States', lat: 25.7617, lon: -80.1918 },
  { city: 'Atlanta', country: 'United States', lat: 33.749, lon: -84.388 },
  { city: 'Las Vegas', country: 'United States', lat: 36.1699, lon: -115.1398 },
  { city: 'Minneapolis', country: 'United States', lat: 44.9778, lon: -93.265 },
  { city: 'Portland', country: 'United States', lat: 45.5051, lon: -122.675 },
  { city: 'Nashville', country: 'United States', lat: 36.1627, lon: -86.7816 },
  { city: 'Austin', country: 'United States', lat: 30.2672, lon: -97.7431 },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832 },
  { city: 'Vancouver', country: 'Canada', lat: 49.2827, lon: -123.1207 },
  { city: 'Montreal', country: 'Canada', lat: 45.5017, lon: -73.5673 },
  { city: 'Calgary', country: 'Canada', lat: 51.0447, lon: -114.0719 },
  { city: 'Ottawa', country: 'Canada', lat: 45.4215, lon: -75.6972 },
  { city: 'Mexico City', country: 'Mexico', lat: 19.4326, lon: -99.1332 },
  { city: 'Guadalajara', country: 'Mexico', lat: 20.6597, lon: -103.3496 },
  { city: 'Monterrey', country: 'Mexico', lat: 25.6866, lon: -100.3161 },
  // South America
  { city: 'São Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333 },
  { city: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lon: -43.1729 },
  { city: 'Brasília', country: 'Brazil', lat: -15.7801, lon: -47.9292 },
  { city: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816 },
  { city: 'Lima', country: 'Peru', lat: -12.0464, lon: -77.0428 },
  { city: 'Bogotá', country: 'Colombia', lat: 4.711, lon: -74.0721 },
  { city: 'Santiago', country: 'Chile', lat: -33.4489, lon: -70.6693 },
  { city: 'Caracas', country: 'Venezuela', lat: 10.4806, lon: -66.9036 },
  { city: 'Quito', country: 'Ecuador', lat: -0.1807, lon: -78.4678 },
  // Europe
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { city: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { city: 'Berlin', country: 'Germany', lat: 52.52, lon: 13.405 },
  { city: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038 },
  { city: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964 },
  { city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041 },
  { city: 'Vienna', country: 'Austria', lat: 48.2082, lon: 16.3738 },
  { city: 'Stockholm', country: 'Sweden', lat: 59.3293, lon: 18.0686 },
  { city: 'Oslo', country: 'Norway', lat: 59.9139, lon: 10.7522 },
  { city: 'Copenhagen', country: 'Denmark', lat: 55.6761, lon: 12.5683 },
  { city: 'Helsinki', country: 'Finland', lat: 60.1699, lon: 24.9384 },
  { city: 'Zurich', country: 'Switzerland', lat: 47.3769, lon: 8.5417 },
  { city: 'Brussels', country: 'Belgium', lat: 50.8503, lon: 4.3517 },
  { city: 'Warsaw', country: 'Poland', lat: 52.2297, lon: 21.0122 },
  { city: 'Prague', country: 'Czech Republic', lat: 50.0755, lon: 14.4378 },
  { city: 'Budapest', country: 'Hungary', lat: 47.4979, lon: 19.0402 },
  { city: 'Bucharest', country: 'Romania', lat: 44.4268, lon: 26.1025 },
  { city: 'Athens', country: 'Greece', lat: 37.9838, lon: 23.7275 },
  { city: 'Lisbon', country: 'Portugal', lat: 38.7223, lon: -9.1393 },
  { city: 'Dublin', country: 'Ireland', lat: 53.3498, lon: -6.2603 },
  { city: 'Edinburgh', country: 'United Kingdom', lat: 55.9533, lon: -3.1883 },
  { city: 'Manchester', country: 'United Kingdom', lat: 53.4808, lon: -2.2426 },
  { city: 'Barcelona', country: 'Spain', lat: 41.3851, lon: 2.1734 },
  { city: 'Milan', country: 'Italy', lat: 45.4654, lon: 9.1859 },
  { city: 'Munich', country: 'Germany', lat: 48.1351, lon: 11.582 },
  { city: 'Hamburg', country: 'Germany', lat: 53.5753, lon: 10.0153 },
  { city: 'Kyiv', country: 'Ukraine', lat: 50.4501, lon: 30.5234 },
  { city: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173 },
  { city: 'St. Petersburg', country: 'Russia', lat: 59.9311, lon: 30.3609 },
  { city: 'Reykjavik', country: 'Iceland', lat: 64.1355, lon: -21.8954 },
  // Middle East & Africa
  { city: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708 },
  { city: 'Abu Dhabi', country: 'UAE', lat: 24.4539, lon: 54.3773 },
  { city: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lon: 46.6753 },
  { city: 'Tel Aviv', country: 'Israel', lat: 32.0853, lon: 34.7818 },
  { city: 'Jerusalem', country: 'Israel', lat: 31.7683, lon: 35.2137 },
  { city: 'Istanbul', country: 'Turkey', lat: 41.0082, lon: 28.9784 },
  { city: 'Ankara', country: 'Turkey', lat: 39.9334, lon: 32.8597 },
  { city: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357 },
  { city: 'Lagos', country: 'Nigeria', lat: 6.5244, lon: 3.3792 },
  { city: 'Johannesburg', country: 'South Africa', lat: -26.2041, lon: 28.0473 },
  { city: 'Cape Town', country: 'South Africa', lat: -33.9249, lon: 18.4241 },
  { city: 'Nairobi', country: 'Kenya', lat: -1.2921, lon: 36.8219 },
  { city: 'Casablanca', country: 'Morocco', lat: 33.5731, lon: -7.5898 },
  { city: 'Accra', country: 'Ghana', lat: 5.6037, lon: -0.187 },
  { city: 'Addis Ababa', country: 'Ethiopia', lat: 9.032, lon: 38.7469 },
  { city: 'Beirut', country: 'Lebanon', lat: 33.8938, lon: 35.5018 },
  { city: 'Tehran', country: 'Iran', lat: 35.6892, lon: 51.389 },
  { city: 'Baghdad', country: 'Iraq', lat: 33.3152, lon: 44.3661 },
  { city: 'Doha', country: 'Qatar', lat: 25.2854, lon: 51.531 },
  { city: 'Kuwait City', country: 'Kuwait', lat: 29.3759, lon: 47.9774 },
  { city: 'Amman', country: 'Jordan', lat: 31.9539, lon: 35.9106 },
  { city: 'Muscat', country: 'Oman', lat: 23.5859, lon: 58.4059 },
  { city: 'Algiers', country: 'Algeria', lat: 36.7372, lon: 3.0865 },
  { city: 'Tunis', country: 'Tunisia', lat: 36.8065, lon: 10.1815 },
  { city: 'Khartoum', country: 'Sudan', lat: 15.5007, lon: 32.5599 },
  { city: 'Dar es Salaam', country: 'Tanzania', lat: -6.7924, lon: 39.2083 },
  // Asia
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { city: 'Osaka', country: 'Japan', lat: 34.6937, lon: 135.5023 },
  { city: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.978 },
  { city: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074 },
  { city: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737 },
  { city: 'Guangzhou', country: 'China', lat: 23.1291, lon: 113.2644 },
  { city: 'Shenzhen', country: 'China', lat: 22.5431, lon: 114.0579 },
  { city: 'Hong Kong', country: 'China', lat: 22.3193, lon: 114.1694 },
  { city: 'Taipei', country: 'Taiwan', lat: 25.033, lon: 121.5654 },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { city: 'Bangkok', country: 'Thailand', lat: 13.7563, lon: 100.5018 },
  { city: 'Kuala Lumpur', country: 'Malaysia', lat: 3.139, lon: 101.6869 },
  { city: 'Jakarta', country: 'Indonesia', lat: -6.2088, lon: 106.8456 },
  { city: 'Manila', country: 'Philippines', lat: 14.5995, lon: 120.9842 },
  { city: 'Hanoi', country: 'Vietnam', lat: 21.0285, lon: 105.8542 },
  { city: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lon: 106.6297 },
  { city: 'Mumbai', country: 'India', lat: 19.076, lon: 72.8777 },
  { city: 'Delhi', country: 'India', lat: 28.6139, lon: 77.209 },
  { city: 'Bangalore', country: 'India', lat: 12.9716, lon: 77.5946 },
  { city: 'Chennai', country: 'India', lat: 13.0827, lon: 80.2707 },
  { city: 'Kolkata', country: 'India', lat: 22.5726, lon: 88.3639 },
  { city: 'Hyderabad', country: 'India', lat: 17.385, lon: 78.4867 },
  { city: 'Pune', country: 'India', lat: 18.5204, lon: 73.8567 },
  { city: 'Ahmedabad', country: 'India', lat: 23.0225, lon: 72.5714 },
  { city: 'Karachi', country: 'Pakistan', lat: 24.8607, lon: 67.0011 },
  { city: 'Lahore', country: 'Pakistan', lat: 31.5204, lon: 74.3587 },
  { city: 'Islamabad', country: 'Pakistan', lat: 33.6844, lon: 73.0479 },
  { city: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lon: 90.4125 },
  { city: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lon: 79.8612 },
  { city: 'Kathmandu', country: 'Nepal', lat: 27.7172, lon: 85.324 },
  { city: 'Ulaanbaatar', country: 'Mongolia', lat: 47.8864, lon: 106.9057 },
  { city: 'Tashkent', country: 'Uzbekistan', lat: 41.2995, lon: 69.2401 },
  { city: 'Baku', country: 'Azerbaijan', lat: 40.4093, lon: 49.8671 },
  { city: 'Tbilisi', country: 'Georgia', lat: 41.6938, lon: 44.8015 },
  { city: 'Yerevan', country: 'Armenia', lat: 40.1872, lon: 44.5152 },
  // Oceania
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { city: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631 },
  { city: 'Brisbane', country: 'Australia', lat: -27.4698, lon: 153.0251 },
  { city: 'Perth', country: 'Australia', lat: -31.9505, lon: 115.8605 },
  { city: 'Adelaide', country: 'Australia', lat: -34.9285, lon: 138.6007 },
  { city: 'Auckland', country: 'New Zealand', lat: -36.8509, lon: 174.7645 },
  { city: 'Wellington', country: 'New Zealand', lat: -41.2865, lon: 174.7762 },
];

export function searchCities(query: string, limit = 6): City[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const results = CITIES.filter(
    (c) =>
      c.city.toLowerCase().startsWith(q) ||
      c.city.toLowerCase().includes(` ${q}`) ||
      c.country.toLowerCase().startsWith(q),
  );

  // Prioritise "starts with" matches
  results.sort((a, b) => {
    const aStarts = a.city.toLowerCase().startsWith(q);
    const bStarts = b.city.toLowerCase().startsWith(q);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return a.city.localeCompare(b.city);
  });

  return results.slice(0, limit);
}

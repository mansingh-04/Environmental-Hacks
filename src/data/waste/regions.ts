/** Demo regional price adjustments for major Indian metros. Replace with a regional price feed later. */
export interface PriceRegion {
  name: string;
  lat: number;
  lng: number;
  multiplier: number;
}

export const REGION_RADIUS_KM = 80;

export const PRICE_REGIONS: PriceRegion[] = [
  { name: "Delhi NCR", lat: 28.61, lng: 77.21, multiplier: 1.1 },
  { name: "Mumbai", lat: 19.08, lng: 72.88, multiplier: 1.15 },
  { name: "Bengaluru", lat: 12.97, lng: 77.59, multiplier: 1.05 },
  { name: "Chennai", lat: 13.08, lng: 80.27, multiplier: 1.0 },
  { name: "Hyderabad", lat: 17.39, lng: 78.49, multiplier: 1.0 },
  { name: "Kolkata", lat: 22.57, lng: 88.36, multiplier: 0.9 },
  { name: "Pune", lat: 18.52, lng: 73.86, multiplier: 1.05 },
];

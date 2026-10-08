import type { Recycler, WasteCategory } from "@/types/waste";

/** Demo locations. Replace with a real recycler directory / maps API later. */
export const RECYCLERS: Record<WasteCategory, Recycler[]> = {
  plastic: [
    { name: "GreenLoop Scrap Collectors", type: "Scrap dealer", location: "Market Road, Sector 4", distanceKm: 0.8, hours: "9 am – 7 pm" },
    { name: "Ward Dry Waste Collection Centre", type: "Municipal centre", location: "Community Hall, Block B", distanceKm: 1.6, hours: "8 am – 4 pm" },
  ],
  paper: [
    { name: "GreenLoop Scrap Collectors", type: "Scrap dealer", location: "Market Road, Sector 4", distanceKm: 0.8, hours: "9 am – 7 pm" },
  ],
  metal: [
    { name: "City Metal Recyclers", type: "Metal recycler", location: "Industrial Area, Phase 2", distanceKm: 2.3, hours: "10 am – 6 pm" },
    { name: "GreenLoop Scrap Collectors", type: "Scrap dealer", location: "Market Road, Sector 4", distanceKm: 0.8, hours: "9 am – 7 pm" },
  ],
  glass: [
    { name: "Ward Dry Waste Collection Centre", type: "Municipal centre", location: "Community Hall, Block B", distanceKm: 1.6, hours: "8 am – 4 pm" },
  ],
  "e-waste": [
    { name: "Certified E-Waste Drop Point", type: "Authorised e-waste collector", location: "Tech Park Gate 2", distanceKm: 3.1, hours: "10 am – 8 pm" },
  ],
  hazardous: [
    { name: "Battery Collection Box — Electronics Mall", type: "Battery drop-off", location: "Ground Floor, Central Mall", distanceKm: 1.9, hours: "11 am – 9 pm" },
    { name: "Certified E-Waste Drop Point", type: "Authorised e-waste collector", location: "Tech Park Gate 2", distanceKm: 3.1, hours: "10 am – 8 pm" },
  ],
};

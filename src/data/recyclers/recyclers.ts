import type { WasteCategory } from "@/types/waste";

export interface RecyclerSite {
  name: string;
  type: string;
  address: string;
  accepts: string[];
  hours: string;
  categories: WasteCategory[];
  /** Demo-only: sites are placed relative to the user (km north, km east) so distances are meaningful anywhere. */
  offsetKm: { north: number; east: number };
}

/** Demo recycler directory. Replace with a real recycler directory / places API later. */
export const RECYCLER_SITES: RecyclerSite[] = [
  {
    name: "GreenLoop Scrap Collectors",
    type: "Scrap dealer",
    address: "Market Road",
    accepts: ["PET plastic", "Cardboard", "Metal cans", "Glass bottles"],
    hours: "9 am – 7 pm",
    categories: ["plastic", "paper", "metal", "glass"],
    offsetKm: { north: 0.5, east: 0.6 },
  },
  {
    name: "Ward Dry Waste Collection Centre",
    type: "Municipal centre",
    address: "Community Hall",
    accepts: ["Plastics", "Paper", "Glass"],
    hours: "8 am – 4 pm",
    categories: ["plastic", "paper", "glass"],
    offsetKm: { north: -1.2, east: 0.9 },
  },
  {
    name: "City Metal Recyclers",
    type: "Metal recycler",
    address: "Industrial Area",
    accepts: ["Aluminium", "Steel", "Copper"],
    hours: "10 am – 6 pm",
    categories: ["metal"],
    offsetKm: { north: 1.8, east: -1.5 },
  },
  {
    name: "Certified E-Waste Drop Point",
    type: "Authorised e-waste collector",
    address: "Tech Park Gate 2",
    accepts: ["Chargers & cables", "Phones", "Batteries"],
    hours: "10 am – 8 pm",
    categories: ["e-waste", "hazardous"],
    offsetKm: { north: -2.4, east: -1.9 },
  },
  {
    name: "Battery Collection Box — Electronics Store",
    type: "Battery drop-off",
    address: "High Street",
    accepts: ["AA/AAA cells", "Phone batteries"],
    hours: "11 am – 9 pm",
    categories: ["hazardous"],
    offsetKm: { north: 1.1, east: 1.4 },
  },
];

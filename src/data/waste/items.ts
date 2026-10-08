import type { WasteCategory, WasteItemId } from "@/types/waste";

/**
 * Demo knowledge base. Replace with a real structured source (DB, CMS, municipal API) later.
 * Values are indicative Indian scrap-market ranges, not quotes.
 */
export interface WasteItemRecord {
  id: WasteItemId;
  name: string;
  material: string;
  category: WasteCategory;
  categoryLabel: string;
  recyclable: boolean;
  hazardous: boolean;
  disposalInstruction: string;
  preparationSteps: string[];
  warnings: string[];
  earning: { method: string; explanation: string };
  impact: { harm: string; benefit: string; fact: string };
}

export const WASTE_ITEMS: Record<WasteItemId, WasteItemRecord> = {
  "pet-bottle": {
    id: "pet-bottle",
    name: "PET Plastic Bottle",
    material: "PET (#1 plastic)",
    category: "plastic",
    categoryLabel: "Recyclable Plastic",
    recyclable: true,
    hazardous: false,
    disposalInstruction: "Put it in your dry-waste / recyclables bin, or sell it with other PET bottles.",
    preparationSteps: [
      "Empty any remaining liquid",
      "Give it a quick rinse",
      "Crush it flat to save space",
      "Keep the cap on — caps are recycled too",
    ],
    warnings: ["Don't burn plastic — it releases toxic fumes."],
    earning: {
      method: "Sell to a local scrap dealer (kabadiwala)",
      explanation: "Collect bottles until you have a bag or two. Dealers buy clean PET by weight; around 25–30 bottles make 1 kg.",
    },
    impact: {
      harm: "Dumped bottles take centuries to break down and become microplastics in soil and water.",
      benefit: "Recycled PET becomes new bottles, polyester fabric and carpet fibre.",
      fact: "Recycling 1 kg of PET saves roughly 1.5 kg of CO₂ versus making new plastic.",
    },
  },
  "cardboard-box": {
    id: "cardboard-box",
    name: "Cardboard Box",
    material: "Corrugated cardboard",
    category: "paper",
    categoryLabel: "Recyclable Paper",
    recyclable: true,
    hazardous: false,
    disposalInstruction: "Flatten it and add it to dry waste, or sell it to a scrap dealer.",
    preparationSteps: [
      "Remove plastic tape and labels",
      "Take out foam or plastic packing",
      "Flatten the box",
      "Keep it dry",
    ],
    warnings: ["Greasy or wet cardboard (e.g. pizza boxes) can't be recycled — compost it instead."],
    earning: {
      method: "Sell to a local scrap dealer (kabadiwala)",
      explanation: "Dealers buy flattened, dry cardboard by weight. Stack boxes from deliveries and sell together.",
    },
    impact: {
      harm: "Cardboard in landfill rots without oxygen and releases methane, a strong greenhouse gas.",
      benefit: "Recycled fibre becomes new boxes and paper, reducing the need to cut trees.",
      fact: "Each tonne of recycled cardboard saves about 17 trees' worth of fibre.",
    },
  },
  "aluminum-can": {
    id: "aluminum-can",
    name: "Aluminium Can",
    material: "Aluminium",
    category: "metal",
    categoryLabel: "Recyclable Metal",
    recyclable: true,
    hazardous: false,
    disposalInstruction: "Put it in dry waste or keep it aside to sell — cans are the most valuable household recyclable.",
    preparationSteps: ["Empty it completely", "Rinse out sticky residue", "Crush it to save space"],
    warnings: [],
    earning: {
      method: "Sell to a scrap dealer or metal recycler",
      explanation: "Aluminium fetches one of the best scrap rates. About 60–70 cans make 1 kg.",
    },
    impact: {
      harm: "Mining new aluminium (bauxite) clears forests and uses huge amounts of electricity.",
      benefit: "Aluminium can be recycled endlessly — a can can be back on the shelf in about 60 days.",
      fact: "Recycling aluminium uses about 95% less energy than producing it from ore.",
    },
  },
  "glass-bottle": {
    id: "glass-bottle",
    name: "Glass Bottle",
    material: "Soda-lime glass",
    category: "glass",
    categoryLabel: "Recyclable Glass",
    recyclable: true,
    hazardous: false,
    disposalInstruction: "Keep it unbroken and give it to a scrap dealer or glass collection point.",
    preparationSteps: ["Empty and rinse it", "Remove the metal or plastic cap", "Keep it intact — don't smash it"],
    warnings: ["Wrap broken glass in paper and label it so collectors don't get hurt."],
    earning: {
      method: "Return or sell intact bottles",
      explanation: "Some brands and dealers buy intact bottles for reuse. Broken glass is usually accepted free.",
    },
    impact: {
      harm: "Glass never biodegrades, and broken pieces injure people and animals.",
      benefit: "Glass recycles endlessly without losing quality.",
      fact: "Using recycled glass lets furnaces run cooler, cutting energy use by up to 30%.",
    },
  },
  "phone-charger": {
    id: "phone-charger",
    name: "Phone Charger",
    material: "Mixed plastic, copper & circuit board",
    category: "e-waste",
    categoryLabel: "E-Waste",
    recyclable: true,
    hazardous: true,
    disposalInstruction: "Never put it in household bins. Take it to an authorised e-waste collection point.",
    preparationSteps: ["Unplug it and keep the cable attached", "Bundle it with any other old electronics"],
    warnings: ["Contains metals that leach into soil if dumped.", "Don't cut cables or burn them to extract copper."],
    earning: {
      method: "Sell to an e-waste collector",
      explanation: "Collectors pay a small amount for chargers and cables because of the copper inside. Bulk e-waste gets better rates.",
    },
    impact: {
      harm: "Dumped or burned e-waste releases lead and brominated chemicals into air and groundwater.",
      benefit: "Proper recycling recovers copper and plastics and safely handles toxic parts.",
      fact: "Over 60 million tonnes of e-waste are generated worldwide each year — under a quarter is formally recycled.",
    },
  },
  battery: {
    id: "battery",
    name: "Battery",
    material: "Alkaline / lithium cell",
    category: "hazardous",
    categoryLabel: "Hazardous Waste",
    recyclable: true,
    hazardous: true,
    disposalInstruction: "Never put it in any household bin. Drop it at a battery or e-waste collection box.",
    preparationSteps: [
      "Tape over both terminals",
      "Store in a dry container until drop-off",
      "Don't puncture, crush or heat it",
    ],
    warnings: ["Lithium batteries can catch fire in garbage trucks.", "Keep away from children."],
    earning: {
      method: "No cash value — but safe disposal is free",
      explanation: "Household batteries have no resale value. Many electronics stores and e-waste centres accept them free of charge.",
    },
    impact: {
      harm: "Batteries leak heavy metals and corrosive chemicals; lithium cells cause landfill and truck fires.",
      benefit: "Recycling recovers zinc, manganese, lithium and cobalt and keeps toxins out of water.",
      fact: "A single lithium battery fire can shut down a whole waste facility.",
    },
  },
};

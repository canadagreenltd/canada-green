import type { Sector } from "@/lib/constants";

export type ProjectStatus = "open" | "funded" | "closed";

export type Project = {
  id: string;
  slug: string;
  title: string;
  sector: Sector;
  location: string;
  status: ProjectStatus;
  targetCad: number;
  raisedCad: number;
  expectedReturnMin: number;
  expectedReturnMax: number;
  termYears: number;
  minInvestment: number;
  investorCount: number;
  images: string[];
  description: string;
  overview: string;
  whyItMatters: string;
  financials: {
    useOfFunds: { label: string; percent: number }[];
  };
  riskDisclosure: string;
  featured: boolean;
  createdAt: string;
  endingSoon?: boolean;
};

export const projects: Project[] = [
  {
    id: "toronto-fast-charge-hub",
    slug: "toronto-fast-charge-hub",
    title: "Toronto Fast-Charge Hub",
    sector: "ev",
    location: "Toronto, Ontario",
    status: "open",
    targetCad: 2_500_000,
    raisedCad: 1_875_000,
    expectedReturnMin: 8,
    expectedReturnMax: 11,
    termYears: 5,
    minInvestment: 500,
    investorCount: 342,
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80",
    ],
    description:
      "A 24-stall DC fast-charging hub in downtown Toronto serving urban EV drivers and commercial fleets.",
    overview:
      "The Toronto Fast-Charge Hub will deliver 24 high-power DC chargers in a transit-accessible location near the Gardiner Expressway. The project funds site acquisition, electrical upgrades, canopy installation, and a 5-year operations reserve. Revenue comes from per-kWh charging fees and fleet partnership contracts with local logistics operators.",
    whyItMatters:
      "Greater Toronto faces a critical shortage of reliable public DC fast chargers. This hub reduces range anxiety for urban drivers and supports Canada's EV adoption targets while creating skilled local jobs in operations and maintenance.",
    financials: {
      useOfFunds: [
        { label: "Site & electrical infrastructure", percent: 45 },
        { label: "Charging hardware", percent: 30 },
        { label: "Construction & permits", percent: 15 },
        { label: "Operations reserve", percent: 10 },
      ],
    },
    riskDisclosure:
      "Investing in infrastructure projects involves risk, including construction delays, utilization shortfalls, regulatory changes, and potential loss of capital. Expected returns are projections based on modeled usage and are not guaranteed. Past performance of similar assets does not predict future results. Eligibility and suitability vary; please review all offering materials carefully.",
    featured: true,
    createdAt: "2026-01-15",
    endingSoon: true,
  },
  {
    id: "okanagan-valley-vertical-farm",
    slug: "okanagan-valley-vertical-farm",
    title: "Okanagan Valley Vertical Farm",
    sector: "agriculture",
    location: "Kelowna, British Columbia",
    status: "open",
    targetCad: 1_800_000,
    raisedCad: 1_260_000,
    expectedReturnMin: 7,
    expectedReturnMax: 10,
    termYears: 6,
    minInvestment: 250,
    investorCount: 218,
    images: [
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80",
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=80",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80",
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80",
    ],
    description:
      "A climate-controlled vertical farm producing leafy greens year-round for Okanagan grocery and food-service markets.",
    overview:
      "This facility expands controlled-environment agriculture in the Okanagan with stacked growing systems, LED lighting, and water recirculation. Capital funds greenhouse shell upgrades, racking systems, climate control, and working capital for the first two growing cycles.",
    whyItMatters:
      "Local year-round produce reduces reliance on long-haul imports, cuts food miles, and strengthens regional food security while creating agri-tech jobs in the Interior.",
    financials: {
      useOfFunds: [
        { label: "Facility & climate systems", percent: 40 },
        { label: "Growing equipment", percent: 35 },
        { label: "Working capital", percent: 15 },
        { label: "Contingency", percent: 10 },
      ],
    },
    riskDisclosure:
      "Agricultural projects face risks including crop loss, energy cost volatility, market price fluctuations, and operational challenges. Returns are not guaranteed. Review all disclosure documents before investing.",
    featured: true,
    createdAt: "2026-02-01",
  },
  {
    id: "highway-401-charging-corridor",
    slug: "highway-401-charging-corridor",
    title: "Highway 401 Charging Corridor",
    sector: "ev",
    location: "Along Highway 401, Ontario",
    status: "open",
    targetCad: 4_200_000,
    raisedCad: 2_520_000,
    expectedReturnMin: 9,
    expectedReturnMax: 12,
    termYears: 7,
    minInvestment: 1_000,
    investorCount: 489,
    images: [
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1200&q=80",
      "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=1200&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
    ],
    description:
      "A network of highway-side fast-charging plazas connecting Windsor to the Quebec border along Canada's busiest corridor.",
    overview:
      "Four multi-stall charging plazas will be built at strategic rest areas along Highway 401. Each site includes 8–12 DC fast chargers, amenities partnership revenue, and grid interconnection upgrades funded through this raise.",
    whyItMatters:
      "Long-distance EV travel across Ontario depends on reliable corridor charging. This project removes a major barrier to EV adoption for families and commercial fleets.",
    financials: {
      useOfFunds: [
        { label: "Multi-site construction", percent: 50 },
        { label: "Chargers & grid upgrades", percent: 35 },
        { label: "Site acquisition costs", percent: 10 },
        { label: "Reserves", percent: 5 },
      ],
    },
    riskDisclosure:
      "Multi-site infrastructure projects carry construction, permitting, and utilization risks. Projected returns are estimates and not guarantees. Capital may be at risk.",
    featured: true,
    createdAt: "2025-12-10",
    endingSoon: true,
  },
  {
    id: "saskatchewan-grain-coop",
    slug: "saskatchewan-grain-coop",
    title: "Saskatchewan Grain Co-op Expansion",
    sector: "agriculture",
    location: "Saskatoon, Saskatchewan",
    status: "open",
    targetCad: 3_100_000,
    raisedCad: 1_550_000,
    expectedReturnMin: 6,
    expectedReturnMax: 9,
    termYears: 8,
    minInvestment: 500,
    investorCount: 176,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=80",
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
    ],
    description:
      "Modernizing grain storage and handling for a prairie co-operative serving 120+ family farms.",
    overview:
      "Funds expand silo capacity, install moisture-control systems, and upgrade rail loading to reduce harvest bottlenecks and improve pricing power for member farms.",
    whyItMatters:
      "Efficient storage keeps more value on the Prairies, supports rural employment, and reduces post-harvest loss for Canadian grain producers.",
    financials: {
      useOfFunds: [
        { label: "Storage infrastructure", percent: 55 },
        { label: "Handling equipment", percent: 25 },
        { label: "Rail & logistics upgrades", percent: 15 },
        { label: "Working capital", percent: 5 },
      ],
    },
    riskDisclosure:
      "Commodity and weather risks affect agricultural co-ops. Returns depend on harvest volumes and market conditions and are not guaranteed.",
    featured: true,
    createdAt: "2026-01-28",
  },
  {
    id: "vancouver-urban-chargers",
    slug: "vancouver-urban-chargers",
    title: "Vancouver Urban Charger Network",
    sector: "ev",
    location: "Vancouver, British Columbia",
    status: "open",
    targetCad: 1_600_000,
    raisedCad: 960_000,
    expectedReturnMin: 7,
    expectedReturnMax: 10,
    termYears: 4,
    minInvestment: 250,
    investorCount: 201,
    images: [
      "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=1200&q=80",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80",
    ],
    description:
      "Level 2 and DC chargers across apartment and retail parking lots in Metro Vancouver.",
    overview:
      "A distributed network of workplace and residential chargers designed for condo and retail partnerships across Burnaby, Vancouver, and Richmond.",
    whyItMatters:
      "Most EV charging happens where people live and work. This network fills gaps in dense urban housing where home charging is unavailable.",
    financials: {
      useOfFunds: [
        { label: "Hardware deployment", percent: 50 },
        { label: "Site partnerships", percent: 25 },
        { label: "Installation labour", percent: 20 },
        { label: "Software & ops", percent: 5 },
      ],
    },
    riskDisclosure:
      "Distributed EV networks face site-access, utilization, and partner-contract risks. Returns are not guaranteed.",
    featured: false,
    createdAt: "2026-03-01",
  },
  {
    id: "quebec-berry-greenhouse",
    slug: "quebec-berry-greenhouse",
    title: "Québec Berry Greenhouse",
    sector: "agriculture",
    location: "Mirabel, Québec",
    status: "open",
    targetCad: 2_200_000,
    raisedCad: 880_000,
    expectedReturnMin: 8,
    expectedReturnMax: 11,
    termYears: 6,
    minInvestment: 500,
    investorCount: 134,
    images: [
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=80",
    ],
    description:
      "Expanding a hydroponic berry greenhouse to supply Québec grocers with local strawberries year-round.",
    overview:
      "Capital expands growing acreage under glass, upgrades fertigation systems, and funds cold-chain packaging for retail distribution across Québec.",
    whyItMatters:
      "Extending the local berry season reduces import dependence and supports agri-employment in the Laurentians region.",
    financials: {
      useOfFunds: [
        { label: "Greenhouse expansion", percent: 48 },
        { label: "Hydroponic systems", percent: 30 },
        { label: "Packaging & cold chain", percent: 15 },
        { label: "Contingency", percent: 7 },
      ],
    },
    riskDisclosure:
      "Specialty crop greenhouses face energy, disease, and market risks. Projected returns are not guarantees of performance.",
    featured: false,
    createdAt: "2026-02-20",
  },
  {
    id: "calgary-fleet-depot",
    slug: "calgary-fleet-depot",
    title: "Calgary Fleet Charging Depot",
    sector: "ev",
    location: "Calgary, Alberta",
    status: "open",
    targetCad: 2_800_000,
    raisedCad: 2_100_000,
    expectedReturnMin: 8,
    expectedReturnMax: 12,
    termYears: 5,
    minInvestment: 750,
    investorCount: 267,
    images: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    ],
    description:
      "Overnight depot charging for municipal and last-mile delivery fleets converting to electric vans.",
    overview:
      "A purpose-built depot with 40 Level 2 and DC chargers, load management software, and a power purchase agreement structured for predictable fleet overnight charging revenue.",
    whyItMatters:
      "Fleet electrification delivers outsized emissions reductions. Shared depot infrastructure lowers the barrier for operators transitioning off diesel.",
    financials: {
      useOfFunds: [
        { label: "Depot build-out", percent: 40 },
        { label: "Charging & power systems", percent: 40 },
        { label: "Software & commissioning", percent: 12 },
        { label: "Reserve", percent: 8 },
      ],
    },
    riskDisclosure:
      "Fleet contracts and energy pricing can change. Utilization assumptions may not materialize. Capital is at risk; returns are not guaranteed.",
    featured: false,
    createdAt: "2025-11-20",
    endingSoon: true,
  },
  {
    id: "pei-regenerative-farmland",
    slug: "pei-regenerative-farmland",
    title: "PEI Regenerative Farmland Trust",
    sector: "agriculture",
    location: "Prince Edward Island",
    status: "open",
    targetCad: 1_400_000,
    raisedCad: 700_000,
    expectedReturnMin: 5,
    expectedReturnMax: 8,
    termYears: 10,
    minInvestment: 250,
    investorCount: 98,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=80",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80",
    ],
    description:
      "Acquiring and transitioning Island farmland to regenerative practices with long-term leaseback to next-generation farmers.",
    overview:
      "The trust acquires productive PEI acreage, funds soil health transitions, and leases to young farmers under regenerative covenants that protect long-term land value.",
    whyItMatters:
      "Access to land is a barrier for new farmers. This model keeps Island farmland productive, regenerative, and in Canadian hands.",
    financials: {
      useOfFunds: [
        { label: "Land acquisition", percent: 70 },
        { label: "Soil transition costs", percent: 20 },
        { label: "Legal & stewardship", percent: 10 },
      ],
    },
    riskDisclosure:
      "Land and agricultural investments are illiquid and subject to weather, commodity, and policy risks. Returns are not guaranteed and capital may be at risk.",
    featured: false,
    createdAt: "2026-03-05",
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id || p.slug === id);
}

export function getProjectsBySector(sector: Sector): Project[] {
  return projects.filter((p) => p.sector === sector);
}

export function getFeaturedProjects(limit = 4): Project[] {
  return projects.filter((p) => p.featured).slice(0, limit);
}

export function getFundedPercent(project: Project): number {
  return Math.min(
    100,
    Math.round((project.raisedCad / project.targetCad) * 100)
  );
}

export function formatCad(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

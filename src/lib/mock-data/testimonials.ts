export type Testimonial = {
  id: string;
  name: string;
  city: string;
  quote: string;
  rating: number;
  avatar: string;
  sector: "ev" | "agriculture" | "general";
};

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    city: "Mississauga, ON",
    quote:
      "I wanted my RRSP room to do more than sit in an index fund. Investing in the Highway 401 corridor felt tangible — I'm helping electrify the roads I drive every week.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    sector: "ev",
  },
  {
    id: "2",
    name: "Marc Tremblay",
    city: "Québec City, QC",
    quote:
      "As someone who grew up around farms, the Okanagan vertical farm project connected with me immediately. Transparent updates and a clear use of funds made the decision easy.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    sector: "agriculture",
  },
  {
    id: "3",
    name: "Aisha Okonkwo",
    city: "Calgary, AB",
    quote:
      "Canada Green made crowdfunding feel professional. The risk disclosures are honest, the project pages are clear, and I finally understand where my capital is going.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    sector: "general",
  },
];

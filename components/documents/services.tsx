import {
  type LucideIcon,
  BadgeCheck,
  HeartHandshake,
  Receipt,
  IdCard,
  Home,
  Star,
  Briefcase,
  Plane,
  Users,
  HandHeart,
} from "lucide-react";

export interface RequestDocumentItem {
  title: string;
  description: string;
  tag: string | null;
  fee: string;
  processing: string;
  category: string;
  icon: LucideIcon;
}

export const documents: RequestDocumentItem[] = [
  {
    title: "Barangay Clearance",
    description:
      "Required for employment, business permits, and legal transactions.",
    tag: "Most Requested",
    fee: "₱50",
    processing: "Same day",
    category: "Certificates & Documents",
    icon: BadgeCheck,
  },
  {
    title: "Certificate of Indigency",
    description:
      "For residents qualifying for government assistance and scholarships.",
    tag: null,
    fee: "Free",
    processing: "Same day",
    category: "Assistance Programs",
    icon: HeartHandshake,
  },
  {
    title: "Community Tax Certificate",
    description: "Annual cedula issued to all residents and businesses.",
    tag: null,
    fee: "₱30 and up",
    processing: "Same day",
    category: "Certificates & Documents",
    icon: Receipt,
  },
  {
    title: "Barangay ID",
    description:
      "Official identification card for Barangay San Isidro residents.",
    tag: null,
    fee: "₱100",
    processing: "3–5 days",
    category: "Certificates & Documents",
    icon: IdCard,
  },
  {
    title: "Certificate of Residency",
    description: "Proof of residence for legal, academic, and personal use.",
    tag: null,
    fee: "₱50",
    processing: "Same day",
    category: "Certificates & Documents",
    icon: Home,
  },
  {
    title: "Good Moral Certificate",
    description:
      "Character reference issued for academic and professional applications.",
    tag: null,
    fee: "₱50",
    processing: "Same day",
    category: "Certificates & Documents",
    icon: Star,
  },
  {
    title: "Business Permit Endorsement",
    description:
      "Barangay-level clearance required before applying for a City Hall business permit.",
    tag: null,
    fee: "₱200 and up",
    processing: "1–2 days",
    category: "Permits & Registration",
    icon: Briefcase,
  },
  {
    title: "Certificate for Travel Abroad",
    description:
      "Supporting document for OFWs and first-time travelers applying for a passport or visa.",
    tag: "Popular",
    fee: "₱50",
    processing: "Same day",
    category: "Certificates & Documents",
    icon: Plane,
  },
  {
    title: "Senior Citizen Registration",
    description:
      "Registers residents aged 60 and above for national and local senior citizen benefits.",
    tag: null,
    fee: "Free",
    processing: "3–5 days",
    category: "Assistance Programs",
    icon: Users,
  },
  {
    title: "Solo Parent Registration",
    description:
      "ID and registration for solo parents to access welfare benefits under RA 11861.",
    tag: null,
    fee: "Free",
    processing: "3–5 days",
    category: "Assistance Programs",
    icon: HandHeart,
  },
];

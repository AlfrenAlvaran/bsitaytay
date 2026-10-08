import {
  Eye,
  Target,
  ShieldCheck,
  HeartHandshake,
  Users,
  Scale,
  type LucideIcon,
} from "lucide-react";

export type Official = {
  name: string;
  position: string;
  photo?: string;
  note?: string;
};

export type OfficialGroup = {
  title: string;
  members: Official[];
};

export const captain: Official = {
  name: "Vivian Reyes-Yupangco",
  position: "Punong Barangay",
};

export const officialGroups: OfficialGroup[] = [
  {
    title: "Barangay Council",
    members: [
      { name: "Arky Manning", position: "Barangay Kagawad" },
      { name: "Ian Reyes", position: "Barangay Kagawad" },
      { name: "Babet Esguerra", position: "Barangay Kagawad" },
      { name: "Steph Cabral", position: "Barangay Kagawad" },
    ],
  },
  {
    title: "Sangguniang Kabataan",
    members: [
      { name: "Gerick Francisco", position: "SK Chairperson" },
      { name: "Daren Valdizno", position: "SK Secretary" },
      { name: "Isaiah Francisco", position: "SK Treasurer" },
      { name: "Trysha Dela Cruz", position: "SK Kagawad" },
      { name: "Desiree Suyat", position: "SK Kagawad" },
      { name: "Kyle Abuid", position: "SK Kagawad" },
      { name: "AJ Legaspi", position: "SK Kagawad" },
      { name: "JT Naval", position: "SK Kagawad" },
      { name: "Monique Cabling", position: "SK Kagawad" },
      { name: "Aaron Suguitan", position: "SK Kagawad" },
    ],
  },
];

export const missionVision: {
  icon: LucideIcon;
  label: string;
  text: string;
}[] = [
  {
    icon: Eye,
    label: "Our Vision",
    text: "Isang Barangay na may pamunuan at mamamayang maka-Diyos, maka-tao, makabayan, maka-kalikasan na nagkakaisa at may kakayahang makatugon sa bawat pangangailangan, tungo sa isang maunlad at malusog na komunidad.",
  },
  {
    icon: Target,
    label: "Our Mission",
    text: "Ipagkaloob ang kalidad na serbisyo sa pamamagitan ng angkop na pagsasanay, pag-uugali, kakayahan at kaalaman, at ang paglaan ng sarili sa pagtatamo ng pangkalahatang kapakanan at pagpapabuti ng buhay ng mga kasapi ng komunidad.",
  },
];

export const values: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: ShieldCheck,
    title: "Transparency",
    description: "Open records, clear fees, and honest communication.",
  },
  {
    icon: HeartHandshake,
    title: "Service",
    description: "Every resident is treated with respect and urgency.",
  },
  {
    icon: Scale,
    title: "Accountability",
    description: "We answer to the community we serve.",
  },
  {
    icon: Users,
    title: "Unity",
    description: "Progress is built together with our residents.",
  },
];

export const contact = {
  address: "Aquarius Street, Brgy. San Isidro, Taytay, Rizal",
  hours: "Mon–Fri, 8:30 AM – 4:30 PM",
  hotline: "(02) 8650-0139",
};

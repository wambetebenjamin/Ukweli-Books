/* ==========================================================================
   UKWELI BOOKS — Catalogue, authors, categories, plans, blog, community.
   In production this is seeded into Vercel KV; here it is the source KV
   adapter reads from.
   ========================================================================== */

export type CategorySlug =
  | "fiction"
  | "non-fiction"
  | "academic"
  | "business"
  | "self-development"
  | "african-literature"
  | "children"
  | "religion"
  | "law"
  | "health";

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  { slug: "fiction", name: "Fiction", blurb: "Novels, short stories and thrillers from East Africa and the world.", image: "/images/cat-fiction.jpg" },
  { slug: "non-fiction", name: "Non-Fiction", blurb: "History, biography, current affairs and true stories.", image: "/images/cat-nonfiction.jpg" },
  { slug: "academic", name: "Academic & Textbooks", blurb: "KCSE revision, university texts and open courseware.", image: "/images/cat-academic.jpg" },
  { slug: "business", name: "Business & Finance", blurb: "Entrepreneurship, markets and money sense for the hustle economy.", image: "/images/cat-business.jpg" },
  { slug: "self-development", name: "Self Development", blurb: "Habits, focus, leadership and personal growth.", image: "/images/cat-selfdev.jpg" },
  { slug: "african-literature", name: "African Literature", blurb: "The canon and the new wave of African writing.", image: "/images/cat-african-lit.jpg" },
  { slug: "children", name: "Children", blurb: "Picture books and early readers with African settings.", image: "/images/cat-children.jpg" },
  { slug: "religion", name: "Religion & Spirituality", blurb: "Faith, devotion and spiritual reflection.", image: "/images/cat-religion.jpg" },
  { slug: "law", name: "Law", blurb: "Kenyan and East African legal texts, statutes and commentary.", image: "/images/cat-law.jpg" },
  { slug: "health", name: "Health & Medicine", blurb: "Nursing, clinical practice and public health.", image: "/images/cat-health.jpg" },
];

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  longBio: string[];
  photo: string | null;
  location: string;
  featured?: boolean;
}

export const AUTHORS: Author[] = [
  {
    slug: "wanjiru-kamau",
    name: "Wanjiru Kamau",
    role: "Novelist · Nairobi",
    bio: "Wanjiru writes literary fiction rooted in Nairobi's neighbourhoods — its matatu stages, rooftop gardens and quiet victories. Her work has been shortlisted for regional prizes and translated into Kiswahili and French.",
    longBio: [
      "Wanjiru Kamau grew up in Dagoretti, Nairobi, reading whatever the travelling library van carried that month. She studied literature at the University of Nairobi and spent six years as a features journalist before turning to fiction full-time.",
      "Her novels are known for patient, precise portraits of ordinary Nairobi lives — bus conductors, fundis, market women and ambitious students — and for dialogue that moves effortlessly between English, Sheng and Kiswahili.",
      "She leads the Ukweli Writers' Circle, a monthly workshop for emerging East African novelists, and lives in Nairobi with two cats and an unreliable espresso machine.",
    ],
    photo: "/images/author-wanjiru.jpg",
    location: "Nairobi, Kenya",
    featured: true,
  },
  {
    slug: "baraka-mwangi",
    name: "Baraka Mwangi",
    role: "Poet & Essayist · Dar es Salaam",
    bio: "Baraka writes poetry and essays in English and Kiswahili about memory, coastlines and inheritance. His collections are taught in secondary schools across East Africa.",
    longBio: [
      "Baraka Mwangi was born in Tanga, Tanzania, and raised between the coast and the Usambara mountains. He began performing spoken word at sixteen and published his first chapbook at twenty-two.",
      "His writing braids Swahili oral forms — the tenzi, the shairi — with contemporary free verse, and often returns to the image of the sea as both archive and inheritance.",
      "He is a frequent performer at literature festivals in Dar es Salaam, Kampala and Nairobi, and runs poetry translation workshops for young coastal writers.",
    ],
    photo: "/images/author-baraka.jpg",
    location: "Dar es Salaam, Tanzania",
    featured: true,
  },
  {
    slug: "dr-ochieng-odhiambo",
    name: "Dr. Ochieng Odhiambo",
    role: "Historian · Kisumu",
    bio: "Dr. Odhiambo is a historian of East Africa whose accessible, archive-driven books recover the region's caravan routes, city histories and independence-era debates for general readers.",
    longBio: [
      "Dr. Ochieng Odhiambo teaches history at a university on the shores of Lake Victoria. His research follows the old caravan routes between the coast and the Great Lakes, tracing how trade shaped language, cuisine and family memory across the region.",
      "He believes history belongs to everyone, not just seminar rooms — so his books pair rigorous archival work with storytelling that respects the reader's time.",
      "He hosts a monthly public history salon in Kisumu and advises county museums on community archives.",
    ],
    photo: "/images/author-ochieng.jpg",
    location: "Kisumu, Kenya",
    featured: true,
  },
  {
    slug: "amina-yusuf",
    name: "Amina Yusuf",
    role: "Personal Development Writer · Mombasa",
    bio: "Amina writes practical, unhurried books about habits, focus and earning well — grounded in the realities of East African work and family life.",
    longBio: [
      "Amina Yusuf spent a decade in banking in Mombasa before leaving to study behavioural psychology and write full-time.",
      "Her books reject hustle-culture noise in favour of small, repeatable systems — what she calls 'the discipline of small wins' — and are widely used by youth groups and savings circles across the coast.",
    ],
    photo: null,
    location: "Mombasa, Kenya",
  },
  {
    slug: "grace-nakato",
    name: "Grace Nakato",
    role: "Children's Author · Kampala",
    bio: "Grace writes picture books where East African children are the heroes of their own adventures — talking drums, clever goats, matatus with opinions.",
    longBio: [
      "Grace Nakato is a Kampala-based illustrator and author who began making storybooks for her younger siblings and never really stopped.",
      "Her books are read in classrooms across Uganda and Kenya, and she works with literacy NGOs to get free reading copies to community libraries.",
    ],
    photo: null,
    location: "Kampala, Uganda",
  },
  {
    slug: "david-muthomi",
    name: "David Muthomi",
    role: "Business Writer · Nairobi",
    bio: "David covers markets, SACCOs and small-business finance. His guides translate balance sheets into plain language for founders and chamas.",
    longBio: [
      "David Muthomi is a financial analyst turned writer who has advised dozens of Kenyan SMEs on pricing, bookkeeping and raising capital.",
      "He writes the annual Ukweli SME Finance Outlook and leads practical budgeting clinics for early-stage founders.",
    ],
    photo: null,
    location: "Nairobi, Kenya",
  },
  {
    slug: "rev-daniel-kibet",
    name: "Rev. Daniel Kibet",
    role: "Theologian · Eldoret",
    bio: "Rev. Kibet writes on faith, doubt and devotion for a restless generation, drawing on scripture and East African church life.",
    longBio: [
      "Rev. Daniel Kibet pastors a congregation in Eldoret and lectures part-time on theology and ethics.",
      "His devotional writing is known for honesty about doubt and for rooting ancient texts in everyday Kenyan life.",
    ],
    photo: null,
    location: "Eldoret, Kenya",
  },
];

export interface Book {
  slug: string;
  title: string;
  authorSlug: string;
  publisher: string;
  year: number;
  language: string;
  pages: number;
  formats: string[];
  fileSizeMB: number;
  price: number; // KES — 0 means free
  category: CategorySlug;
  genre: string; // short genre tag on cards
  rating: number;
  reviewCount: number;
  description: string[];
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
}

const P = (b: Book): Book => b;

export const BOOKS: Book[] = [
  // ---------------------------------------------------------------- PAID
  P({
    slug: "beneath-the-jacaranda-sky",
    title: "Beneath the Jacaranda Sky",
    authorSlug: "wanjiru-kamau",
    publisher: "Nairobi Heritage Publishing",
    year: 2025,
    language: "English",
    pages: 312,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 4.2,
    price: 850,
    category: "african-literature",
    genre: "Literary Fiction",
    rating: 4.8,
    reviewCount: 214,
    description: [
      "In the violet weeks when Nairobi's jacarandas bloom, three strangers on the same matatu route discover their lives are knotted together by a single unsigned letter written twenty years earlier. Mama Rotich, who sells tea at the stage; Kevin, a forensic accountant fleeing a scandal; and Zawadi, a flower girl with perfect pitch, each hold a third of a story none of them chose.",
      "Wanjiru Kamau's most ambitious novel yet moves between 1998 and the present with the patience of a city that has seen everything. It is a book about what we inherit without asking — debts, talents, grudges — and the small, surprising ways people forgive each other in traffic, in queues, in church basements.",
      "Shortlisted for the East African Book Prize. 'A novel that hums like the city itself' — The East African Reader.",
    ],
    featured: true,
    bestseller: true,
  }),
  P({
    slug: "the-nairobi-ledger",
    title: "The Nairobi Ledger",
    authorSlug: "wanjiru-kamau",
    publisher: "Nairobi Heritage Publishing",
    year: 2024,
    language: "English",
    pages: 288,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 3.6,
    price: 950,
    category: "fiction",
    genre: "Crime & Mystery",
    rating: 4.6,
    reviewCount: 167,
    description: [
      "When a second-hand ledger surfaces in a Kariobangi book stall, retired court clerk Joseph Nderitu recognises the handwriting of a judge who vanished in 1984. Every page he deciphers implicates someone still alive — and someone still powerful.",
      "A slow-burning mystery that walks you through Nairobi's archives, court corridors and night markets, The Nairobi Ledger asks what a city owes its secrets.",
    ],
    featured: true,
  }),
  P({
    slug: "river-of-ancestors",
    title: "River of Ancestors",
    authorSlug: "baraka-mwangi",
    publisher: "Pwani Books",
    year: 2025,
    language: "English",
    pages: 246,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 2.9,
    price: 720,
    category: "african-literature",
    genre: "Literary Fiction",
    rating: 4.7,
    reviewCount: 142,
    description: [
      "A fisherman in Tanga finds a brass compass that belonged to his great-grandfather, a guide on the caravan routes. Told in alternating chapters — 1888 and now — River of Ancestors follows one family's cargo of stories down to the sea.",
      "Baraka Mwangi's prose carries the cadence of the coast: patient, salt-bright, and full of weather. A novel about what journeys cost and what they return.",
    ],
    featured: true,
    newArrival: true,
  }),
  P({
    slug: "sermons-of-the-acacia",
    title: "Sermons of the Acacia",
    authorSlug: "baraka-mwangi",
    publisher: "Pwani Books",
    year: 2023,
    language: "English / Kiswahili",
    pages: 104,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 1.4,
    price: 480,
    category: "african-literature",
    genre: "Poetry",
    rating: 4.9,
    reviewCount: 98,
    description: [
      "Forty-two poems in English and Kiswahili — praise songs for ferry queues, elegies for cut-down trees, love poems addressed to Mondays. Baraka Mwangi's breakthrough collection braids the tenzi form with free verse.",
      "Includes the award-winning title poem, now studied in secondary schools across East Africa, with a new author's note on translation.",
    ],
    featured: true,
  }),
  P({
    slug: "caravan-of-salt",
    title: "Caravan of Salt: East Africa's Hidden Highways",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "East African Review Books",
    year: 2024,
    language: "English",
    pages: 384,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 6.8,
    price: 1250,
    category: "non-fiction",
    genre: "History",
    rating: 4.8,
    reviewCount: 203,
    description: [
      "Before the railway, there were the caravan routes — walking highways that carried salt, ivory, cloth and ideas between the Swahili coast and the Great Lakes. Dr. Ochieng Odhiambo walked five of them, notebook in hand, reading old guidebooks against the modern landscape.",
      "The result is history you can feel under your feet: port towns that moved inland, languages traded alongside goods, and family names that map a road.",
      "With 30 hand-drawn route maps and a gazetteer of sites you can visit today.",
    ],
    featured: true,
    bestseller: true,
  }),
  P({
    slug: "the-founders-bargain",
    title: "The Founders' Bargain: Kenya 1963 Reconsidered",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "East African Review Books",
    year: 2025,
    language: "English",
    pages: 328,
    formats: ["PDF"],
    fileSizeMB: 5.1,
    price: 1100,
    category: "non-fiction",
    genre: "History & Politics",
    rating: 4.5,
    reviewCount: 76,
    description: [
      "What was promised at independence, and by whom? Drawing on newly opened county archives, Dr. Odhiambo reconstructs the negotiations — public and private — that shaped Kenya's first decade.",
      "Even-handed, readable and quietly radical: a book that lets the documents argue.",
    ],
    newArrival: true,
  }),
  P({
    slug: "start-where-you-stand",
    title: "Start Where You Stand",
    authorSlug: "amina-yusuf",
    publisher: "Kijani Press",
    year: 2024,
    language: "English",
    pages: 208,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 2.2,
    price: 650,
    category: "self-development",
    genre: "Personal Growth",
    rating: 4.6,
    reviewCount: 311,
    description: [
      "You don't need a new city, a new job or a new year. Amina Yusuf's warm, practical guide starts with what you have: your matatu time, your phone, your chama, your Sunday quiet.",
      "Twelve chapters, twelve small systems — for money, for focus, for rest — each tested with readers in Mombasa, Nairobi and Malindi before a word was printed.",
    ],
    featured: true,
    bestseller: true,
  }),
  P({
    slug: "the-discipline-of-small-wins",
    title: "The Discipline of Small Wins",
    authorSlug: "amina-yusuf",
    publisher: "Kijani Press",
    year: 2025,
    language: "English",
    pages: 176,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 1.9,
    price: 590,
    category: "self-development",
    genre: "Habits & Focus",
    rating: 4.7,
    reviewCount: 129,
    description: [
      "Big goals fail loudly; small wins compound quietly. This workbook-format guide gives you a 66-day structure for building one habit at a time, with tracking pages designed for printing or annotation.",
      "Includes the 'Two-Minute Daraja' method for restarting after a broken streak — the chapter readers write to Amina about most.",
    ],
    newArrival: true,
  }),
  P({
    slug: "financial-fluency-for-the-hustle-economy",
    title: "Financial Fluency for the Hustle Economy",
    authorSlug: "david-muthomi",
    publisher: "Ukweli Business",
    year: 2025,
    language: "English",
    pages: 264,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 3.1,
    price: 980,
    category: "business",
    genre: "Personal Finance",
    rating: 4.5,
    reviewCount: 187,
    description: [
      "Freelance income, side hustles, chama dividends — modern East African money life doesn't fit old advice. David Muthomi rebuilds personal finance for irregular income: buffer maths, pricing your skill, borrowing without bleeding.",
      "With worksheets adapted from real SME clinics and a full chapter on M-Pesa-era record keeping.",
    ],
    featured: true,
    newArrival: true,
  }),
  P({
    slug: "market-ready-agribusiness-east-africa",
    title: "Market-Ready: Modern Agribusiness in East Africa",
    authorSlug: "david-muthomi",
    publisher: "Ukweli Business",
    year: 2024,
    language: "English",
    pages: 298,
    formats: ["PDF"],
    fileSizeMB: 4.7,
    price: 1150,
    category: "business",
    genre: "Agribusiness",
    rating: 4.4,
    reviewCount: 64,
    description: [
      "From two acres to export contracts: a field-tested playbook for East African farmers who want to treat the shamba as a business. Covers pricing, aggregation, cold chains and the honest arithmetic of greenhouses.",
      "Case studies from Meru, Eldoret, Arusha and Mbale, with input checklists for each season.",
    ],
  }),
  P({
    slug: "principles-of-company-law-kenya",
    title: "Principles of Company Law in Kenya, 4th Edition",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "Sheria Academic Press",
    year: 2025,
    language: "English",
    pages: 612,
    formats: ["PDF"],
    fileSizeMB: 12.4,
    price: 2450,
    category: "law",
    genre: "Legal Textbook",
    rating: 4.7,
    reviewCount: 89,
    description: [
      "The standard student text on the Companies Act 2015, fully revised for the 2024 amendments. Doctrines are presented through East African cases — not imported hypotheticals — with problem questions at the end of each chapter.",
      "Includes annotated incorporation documents and a printable revision chart of director duties.",
    ],
  }),
  P({
    slug: "clinical-foundations-nursing-east-africa",
    title: "Clinical Foundations: Nursing Practice in East Africa",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "Afya Education",
    year: 2024,
    language: "English",
    pages: 544,
    formats: ["PDF"],
    fileSizeMB: 15.6,
    price: 2200,
    category: "health",
    genre: "Medical Textbook",
    rating: 4.6,
    reviewCount: 112,
    description: [
      "A clinical nursing text written for East African wards and training colleges: protocols aligned with county referral practice, drug calculations with worked examples, and OSCE-style checklists.",
      "Developed with nurse educators from three national referral hospitals.",
    ],
  }),
  P({
    slug: "kijana-and-the-talking-drum",
    title: "Kijana and the Talking Drum",
    authorSlug: "grace-nakato",
    publisher: "Watoto Books",
    year: 2025,
    language: "English",
    pages: 40,
    formats: ["PDF"],
    fileSizeMB: 8.4,
    price: 380,
    category: "children",
    genre: "Picture Book",
    rating: 4.9,
    reviewCount: 240,
    description: [
      "Kijana finds an old drum in his grandmother's roof — and the drum has opinions. A warm, funny picture book about listening well, in big read-aloud type with full-page illustrations on every spread.",
      "Ages 4–8. Includes a read-along page of the drum's rhythms for kids to clap.",
    ],
    newArrival: true,
  }),
  P({
    slug: "faith-in-a-restless-age",
    title: "Faith in a Restless Age",
    authorSlug: "rev-daniel-kibet",
    publisher: "Nuru Publishers",
    year: 2024,
    language: "English",
    pages: 192,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 1.7,
    price: 550,
    category: "religion",
    genre: "Christian Living",
    rating: 4.6,
    reviewCount: 95,
    description: [
      "For a generation that answers email during the sermon: Rev. Daniel Kibet's honest, unhurried meditations on attention, doubt and devotion. Thirty short chapters, each ending with one practicable act of stillness.",
      "Written during a year of hospital chaplaincy — a book that has sat with real questions.",
    ],
  }),

  // ---------------------------------------------------------------- FREE (24 titles)
  P({
    slug: "narrative-of-olaudah-equiano",
    title: "The Interesting Narrative of the Life of Olaudah Equiano",
    authorSlug: "wanjiru-kamau", // presented by/collection editor
    publisher: "Ukweli Classics (Public Domain)",
    year: 1789,
    language: "English",
    pages: 356,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 2.6,
    price: 0,
    category: "african-literature",
    genre: "African Classic",
    rating: 4.9,
    reviewCount: 512,
    description: [
      "First published in 1789, Equiano's account of his kidnapping from what is now Nigeria, his enslavement, and his self-purchased freedom became one of the founding texts of African literature in English — and helped end the British slave trade.",
      "This Ukweli Classics edition includes a new introduction placing Equiano in the long tradition of African life-writing, plus a glossary of eighteenth-century terms. Public domain text, carefully re-typeset.",
    ],
    featured: true,
  }),
  P({
    slug: "african-proverbs-treasury",
    title: "African Proverbs Treasury",
    authorSlug: "baraka-mwangi",
    publisher: "Ukweli Open (CC-BY)",
    year: 2023,
    language: "English / Kiswahili",
    pages: 148,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 1.8,
    price: 0,
    category: "african-literature",
    genre: "Proverbs & Wisdom",
    rating: 4.7,
    reviewCount: 428,
    description: [
      "Four hundred proverbs from across East Africa — Gikuyu, Swahili, Luo, Luganda, Kikuyu and more — each with translation, origin notes and a short reflection. Compiled by volunteers and released free forever under CC-BY.",
      "Organised by theme: patience, community, work, foolishness, rain.",
    ],
    bestseller: true,
  }),
  P({
    slug: "folktales-from-the-swahili-coast",
    title: "Folktales from the Swahili Coast",
    authorSlug: "baraka-mwangi",
    publisher: "Ukweli Open (CC-BY)",
    year: 2024,
    language: "English",
    pages: 132,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 2.1,
    price: 0,
    category: "african-literature",
    genre: "Folklore",
    rating: 4.8,
    reviewCount: 356,
    description: [
      "Genies in Lamu alleys, trickster hares, the sultan who lost his shadow: twenty-six folktales collected from coastal storytellers and rendered in vivid modern English, with the Kiswahili refrains preserved.",
      "Each tale notes its collector and town of origin. Free for classrooms and libraries.",
    ],
  }),
  P({
    slug: "the-griots-drum-oral-reader",
    title: "The Griot's Drum: An Oral Tradition Reader",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "Ukweli Open (OER)",
    year: 2023,
    language: "English",
    pages: 176,
    formats: ["PDF"],
    fileSizeMB: 2.4,
    price: 0,
    category: "academic",
    genre: "Open Textbook",
    rating: 4.5,
    reviewCount: 143,
    description: [
      "An open courseware reader on East African oral traditions: praise poetry, riddles, epics and testimonies, with recording exercises students can do with elders in their own families.",
      "Used in first-year literature courses at four East African universities.",
    ],
  }),
  P({
    slug: "kcse-mathematics-revision-vol-1",
    title: "KCSE Mathematics Revision, Vol. 1: Algebra & Geometry",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "Kijani Education",
    year: 2025,
    language: "English",
    pages: 228,
    formats: ["PDF"],
    fileSizeMB: 5.8,
    price: 0,
    category: "academic",
    genre: "KCSE Revision",
    rating: 4.6,
    reviewCount: 764,
    description: [
      "Aligned to the KCSE syllabus: every algebra and geometry topic taught, drilled and examined, with 300+ worked examples and past-paper marking-scheme annotations.",
      "Government-sanctioned revision material — free for all Kenyan students.",
    ],
    featured: true,
    bestseller: true,
  }),
  P({
    slug: "kcse-biology-revision-notes",
    title: "KCSE Biology Revision Notes (Forms 1–4)",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "Kijani Education",
    year: 2025,
    language: "English",
    pages: 312,
    formats: ["PDF"],
    fileSizeMB: 7.2,
    price: 0,
    category: "academic",
    genre: "KCSE Revision",
    rating: 4.7,
    reviewCount: 688,
    description: [
      "The full four-year biology syllabus condensed into exam-ready notes: labelled diagrams, definitions that match the marking scheme, and a 40-page 'common confusions' appendix.",
    ],
  }),
  P({
    slug: "kcse-chemistry-practical-guide",
    title: "KCSE Chemistry Practical Guide",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "Kijani Education",
    year: 2024,
    language: "English",
    pages: 164,
    formats: ["PDF"],
    fileSizeMB: 4.9,
    price: 0,
    category: "academic",
    genre: "KCSE Revision",
    rating: 4.5,
    reviewCount: 402,
    description: [
      "Every practical you'll meet in Paper 3, step by step: titrations, qualitative analysis, thermochemistry — with photos of correct setups and the exact phrasing examiners award marks for.",
    ],
  }),
  P({
    slug: "cbc-grade-6-english-activities",
    title: "CBC Grade 6 English Activities",
    authorSlug: "grace-nakato",
    publisher: "Kijani Education",
    year: 2025,
    language: "English",
    pages: 142,
    formats: ["PDF"],
    fileSizeMB: 6.1,
    price: 0,
    category: "academic",
    genre: "CBC Courseware",
    rating: 4.4,
    reviewCount: 233,
    description: [
      "Competency-based activities for Grade 6 English: reading passages set in East African contexts, structured writing tasks and assessment rubrics for teachers and parents.",
    ],
  }),
  P({
    slug: "kiswahili-fasihi-revision",
    title: "Kiswahili: Fasihi Revision Guide",
    authorSlug: "baraka-mwangi",
    publisher: "Kijani Education",
    year: 2024,
    language: "Kiswahili",
    pages: 198,
    formats: ["PDF"],
    fileSizeMB: 3.3,
    price: 0,
    category: "academic",
    genre: "KCSE Revision",
    rating: 4.6,
    reviewCount: 317,
    description: [
      "Mwongozo kamili wa fasihi ya KCSE: riwaya, tamthilia, ushairi na hadithi fupi. Doni hadi mifano ya maswali ya mtihani kwa kila kifina, imeandikwa kwa Kiswahili sanifu.",
    ],
  }),
  P({
    slug: "introduction-kenyan-constitutional-law-oer",
    title: "Introduction to Kenyan Constitutional Law (Open Textbook)",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "Sheria Open (OER)",
    year: 2024,
    language: "English",
    pages: 386,
    formats: ["PDF"],
    fileSizeMB: 6.4,
    price: 0,
    category: "law",
    genre: "Open Textbook",
    rating: 4.8,
    reviewCount: 521,
    description: [
      "A free, lecturer-reviewed introduction to the Constitution of Kenya 2010: the Bill of Rights, devolution, and landmark Supreme Court readings, explained for first-year law students and active citizens alike.",
      "Openly licensed — lecturers may adapt chapters with attribution.",
    ],
    featured: true,
  }),
  P({
    slug: "public-health-east-africa-primer",
    title: "Public Health in East Africa: An Open Primer",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "Afya Open (OER)",
    year: 2024,
    language: "English",
    pages: 274,
    formats: ["PDF"],
    fileSizeMB: 5.2,
    price: 0,
    category: "health",
    genre: "Open Textbook",
    rating: 4.7,
    reviewCount: 289,
    description: [
      "Epidemiology, community health systems and WASH practice in East African settings. Written by public-health officers for CHV training programmes and first-year health sciences students.",
    ],
  }),
  P({
    slug: "swahili-grammar-essentials",
    title: "Swahili Grammar Essentials (Open Textbook)",
    authorSlug: "baraka-mwangi",
    publisher: "Ukweli Open (OER)",
    year: 2023,
    language: "English / Kiswahili",
    pages: 216,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 2.8,
    price: 0,
    category: "academic",
    genre: "Language",
    rating: 4.6,
    reviewCount: 611,
    description: [
      "Noun classes finally explained like a human being would. A friendly, rigorous grammar for learners and teachers, with 200 exercises and a full verb appendix.",
    ],
    bestseller: true,
  }),
  P({
    slug: "digital-literacy-east-african-classrooms",
    title: "Digital Literacy in East African Classrooms (Working Paper)",
    authorSlug: "amina-yusuf",
    publisher: "East African Open Research",
    year: 2025,
    language: "English",
    pages: 68,
    formats: ["PDF"],
    fileSizeMB: 1.6,
    price: 0,
    category: "academic",
    genre: "Open Paper",
    rating: 4.3,
    reviewCount: 87,
    description: [
      "Survey data from 214 schools across Kenya, Uganda and Tanzania: how tablets and phone-first learners are changing reading habits, and what actually improves outcomes. Open-access working paper with full dataset appendix.",
    ],
    newArrival: true,
  }),
  P({
    slug: "mobile-money-financial-inclusion-paper",
    title: "Mobile Money & Financial Inclusion in East Africa (Open Paper)",
    authorSlug: "david-muthomi",
    publisher: "Ukweli Open Research",
    year: 2024,
    language: "English",
    pages: 54,
    formats: ["PDF"],
    fileSizeMB: 1.2,
    price: 0,
    category: "business",
    genre: "Open Paper",
    rating: 4.4,
    reviewCount: 158,
    description: [
      "Fifteen years after M-Pesa: what mobile money changed for savings, credit and small trade — and what it didn't. A readable open paper with county-level case studies.",
    ],
  }),
  P({
    slug: "climate-smart-agriculture-rift-valley",
    title: "Climate-Smart Agriculture in the Rift Valley (Open Paper)",
    authorSlug: "david-muthomi",
    publisher: "Ukweli Open Research",
    year: 2025,
    language: "English",
    pages: 72,
    formats: ["PDF"],
    fileSizeMB: 2.1,
    price: 0,
    category: "health",
    genre: "Open Paper",
    rating: 4.2,
    reviewCount: 63,
    description: [
      "Drought cycles, seed choices and soil recovery across six Rift Valley counties. Practical findings for extension officers and farming groups.",
    ],
  }),
  P({
    slug: "ubuntu-open-essays",
    title: "Ubuntu: Open Essays on African Philosophy",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "Ukweli Open (OER)",
    year: 2023,
    language: "English",
    pages: 190,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 1.9,
    price: 0,
    category: "non-fiction",
    genre: "Philosophy",
    rating: 4.5,
    reviewCount: 174,
    description: [
      "Twelve essays on personhood, community and ethics in African philosophy — written for general readers, with a glossary and further-reading map. Openly licensed anthology.",
    ],
  }),
  P({
    slug: "analysing-african-poetry-companion",
    title: "Analysing African Poetry: A Student Companion",
    authorSlug: "baraka-mwangi",
    publisher: "Ukweli Open (OER)",
    year: 2024,
    language: "English",
    pages: 156,
    formats: ["PDF"],
    fileSizeMB: 2.0,
    price: 0,
    category: "academic",
    genre: "Study Guide",
    rating: 4.7,
    reviewCount: 348,
    description: [
      "How to read a poem slowly, then write about it well. Forty worked analyses of African poems with model essays and examiner commentary. Free for students everywhere.",
    ],
  }),
  P({
    slug: "entrepreneurship-for-tvet-students",
    title: "Entrepreneurship for TVET Students (OER)",
    authorSlug: "david-muthomi",
    publisher: "Kijani Education (OER)",
    year: 2024,
    language: "English",
    pages: 184,
    formats: ["PDF"],
    fileSizeMB: 3.7,
    price: 0,
    category: "business",
    genre: "Open Textbook",
    rating: 4.5,
    reviewCount: 296,
    description: [
      "A practical textbook for technical and vocational students: costing your service, registering a business, keeping records, and pricing labour — with Kenyan forms and examples throughout.",
    ],
  }),
  P({
    slug: "uganda-ple-revision-pack",
    title: "Uganda PLE Revision Pack (All Subjects)",
    authorSlug: "grace-nakato",
    publisher: "Kijani Education",
    year: 2025,
    language: "English",
    pages: 402,
    formats: ["PDF"],
    fileSizeMB: 9.8,
    price: 0,
    category: "academic",
    genre: "PLE Revision",
    rating: 4.6,
    reviewCount: 274,
    description: [
      "The complete Primary Leaving Examination revision companion: mathematics, English, science and SST, past-paper drills and answer schemes, free for Ugandan pupils.",
    ],
  }),
  P({
    slug: "tanzania-secondary-english-revision",
    title: "Tanzania Secondary English Revision (Forms 1–4)",
    authorSlug: "baraka-mwangi",
    publisher: "Kijani Education",
    year: 2024,
    language: "English",
    pages: 266,
    formats: ["PDF"],
    fileSizeMB: 4.4,
    price: 0,
    category: "academic",
    genre: "CSEE Revision",
    rating: 4.4,
    reviewCount: 198,
    description: [
      "Aligned to the Tanzanian syllabus: comprehension, grammar, literature set texts and composition — with model answers and marker's notes.",
    ],
  }),
  P({
    slug: "basic-statistics-social-sciences",
    title: "Basic Statistics for the Social Sciences (OER)",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "Ukweli Open (OER)",
    year: 2023,
    language: "English",
    pages: 242,
    formats: ["PDF"],
    fileSizeMB: 3.9,
    price: 0,
    category: "academic",
    genre: "Open Textbook",
    rating: 4.5,
    reviewCount: 412,
    description: [
      "Descriptive statistics, sampling and hypothesis testing taught through East African datasets: matatu fares, harvest weights, exam results. For first-year university students.",
    ],
  }),
  P({
    slug: "research-methods-handbook",
    title: "The Research Methods Handbook (OER)",
    authorSlug: "dr-ochieng-odhiambo",
    publisher: "Ukweli Open (OER)",
    year: 2024,
    language: "English",
    pages: 290,
    formats: ["PDF"],
    fileSizeMB: 4.1,
    price: 0,
    category: "academic",
    genre: "Open Textbook",
    rating: 4.6,
    reviewCount: 463,
    description: [
      "From research question to reference list: proposal writing, fieldwork ethics, data cleaning and citation, with templates you can reuse. The most-assigned free handbook in our education catalogue.",
    ],
    bestseller: true,
  }),
  P({
    slug: "zuri-and-the-baobab-seed",
    title: "Zuri and the Baobab Seed",
    authorSlug: "grace-nakato",
    publisher: "Watoto Books (CC-BY)",
    year: 2024,
    language: "English",
    pages: 32,
    formats: ["PDF"],
    fileSizeMB: 7.6,
    price: 0,
    category: "children",
    genre: "Picture Book",
    rating: 4.8,
    reviewCount: 389,
    description: [
      "Zuri plants a baobab seed and asks everyone — the tailor, the fisherman, the matatu tout — how big it will grow. A gentle story about patience, in big type for early readers. Free forever under CC-BY.",
    ],
    featured: true,
  }),
  P({
    slug: "the-matatu-that-flew",
    title: "The Matatu That Flew",
    authorSlug: "grace-nakato",
    publisher: "Watoto Books (CC-BY)",
    year: 2025,
    language: "English",
    pages: 36,
    formats: ["PDF"],
    fileSizeMB: 8.1,
    price: 0,
    category: "children",
    genre: "Picture Book",
    rating: 4.9,
    reviewCount: 445,
    description: [
      "One Lagos-Nairobi morning, Matatu No. 44 decides it has had enough of traffic. A joyful, noisy picture book with onomatopoeia kids love to shout. Ages 3–7. Free under CC-BY.",
    ],
    newArrival: true,
  }),
  P({
    slug: "daily-bread-devotional-oer",
    title: "Daily Bread: A Year of Short Devotions (Open Edition)",
    authorSlug: "rev-daniel-kibet",
    publisher: "Nuru Open (CC-BY)",
    year: 2023,
    language: "English",
    pages: 388,
    formats: ["PDF", "EPUB"],
    fileSizeMB: 2.3,
    price: 0,
    category: "religion",
    genre: "Devotional",
    rating: 4.7,
    reviewCount: 517,
    description: [
      "365 short devotions — a verse, a story from East African life, and one line to carry into the day. Released free by the author and publisher for churches and fellowships.",
    ],
    bestseller: true,
  }),
];

// ---------------------------------------------------------------- helpers
export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}
export function getAuthor(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug);
}
export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
export function booksByCategory(slug: string): Book[] {
  return BOOKS.filter((b) => b.category === slug);
}
export function booksByAuthor(slug: string): Book[] {
  return BOOKS.filter((b) => b.authorSlug === slug);
}
export function freeBooks(): Book[] {
  return BOOKS.filter((b) => b.price === 0);
}
export function featuredBooks(): Book[] {
  return BOOKS.filter((b) => b.featured);
}
export function newArrivals(): Book[] {
  return BOOKS.filter((b) => b.newArrival);
}
export function relatedBooks(book: Book, limit = 6): Book[] {
  return BOOKS.filter((b) => b.slug !== book.slug)
    .sort((a, b) => {
      const aScore = (a.category === book.category ? 2 : 0) + (a.authorSlug === book.authorSlug ? 1 : 0) + a.rating / 10;
      const bScore = (b.category === book.category ? 2 : 0) + (b.authorSlug === book.authorSlug ? 1 : 0) + b.rating / 10;
      return bScore - aScore;
    })
    .slice(0, limit);
}
export function searchBooks(q: string): Book[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  return BOOKS.filter((b) => {
    const author = getAuthor(b.authorSlug)?.name ?? "";
    return (
      b.title.toLowerCase().includes(query) ||
      author.toLowerCase().includes(query) ||
      b.genre.toLowerCase().includes(query) ||
      b.category.replace("-", " ").includes(query)
    );
  });
}
export function bookCountsByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of CATEGORIES) counts[c.slug] = booksByCategory(c.slug).length;
  return counts;
}

// ---------------------------------------------------------------- plans
export interface Plan {
  slug: string;
  name: string;
  forWhom: string;
  monthlyKES: number;
  inclusions: string[];
  featured?: boolean;
  badge?: string;
}

export const PLANS: Plan[] = [
  {
    slug: "student",
    name: "Student",
    forWhom: "For learners with a valid school or university email.",
    monthlyKES: 299,
    inclusions: [
      "Unlimited reading of the full catalogue",
      "5 offline PDF downloads per month",
      "All KCSE, PLE and CSEE revision packs",
      "Reading progress sync across devices",
      "New titles added weekly",
    ],
  },
  {
    slug: "personal",
    name: "Personal",
    forWhom: "For readers who never leave home without a book.",
    monthlyKES: 499,
    inclusions: [
      "Everything in Student",
      "Unlimited PDF & EPUB downloads",
      "Early access to new East African releases",
      "Monthly editors' reading list",
      "Priority support on WhatsApp",
    ],
    featured: true,
    badge: "Most Popular",
  },
  {
    slug: "institution",
    name: "Institution",
    forWhom: "For schools, universities and libraries — up to 50 users.",
    monthlyKES: 4999,
    inclusions: [
      "Everything in Personal",
      "Up to 50 managed user seats",
      "Admin dashboard with usage reports",
      "Curriculum-mapped collections (CBC, 8-4-4, UBE)",
      "Bulk licensing for paid titles",
      "Onboarding call and term-time support",
    ],
  },
];

/** Annual billing = 20% discount on monthly x 12 */
export function annualPrice(monthly: number): number {
  return Math.round(monthly * 12 * 0.8);
}

// ---------------------------------------------------------------- reviews
export interface Review {
  id: string;
  bookSlug: string;
  name: string;
  rating: number;
  date: string;
  text: string;
}

export const SEED_REVIEWS: Review[] = [
  { id: "r1", bookSlug: "beneath-the-jacaranda-sky", name: "Mercy A.", rating: 5, date: "2026-08-14", text: "I finished it at 2am and woke my sister to tell her about the ending. Nairobi has never been written so tenderly." },
  { id: "r2", bookSlug: "beneath-the-jacaranda-sky", name: "Brian O.", rating: 5, date: "2026-07-02", text: "The matatu chapters alone are worth the price. Wanjiru keeps getting better." },
  { id: "r3", bookSlug: "beneath-the-jacaranda-sky", name: "Faith N.", rating: 4, date: "2026-06-19", text: "Slow in the middle, but the last hundred pages pay for everything. Beautiful cover-to-cover." },
  { id: "r4", bookSlug: "caravan-of-salt", name: "Hassan M.", rating: 5, date: "2026-05-30", text: "Assigned this to my Form 4 history students. They argued about it for a week — best compliment possible." },
  { id: "r5", bookSlug: "caravan-of-salt", name: "Zainabu S.", rating: 4, date: "2026-04-11", text: "The route maps are gorgeous. Wish there was a Kiswahili edition." },
  { id: "r6", bookSlug: "kcse-mathematics-revision-vol-1", name: "Kevin M.", rating: 5, date: "2026-08-01", text: "My maths went from a C- to an A- in one term. The marking-scheme notes are everything." },
  { id: "r7", bookSlug: "kcse-mathematics-revision-vol-1", name: "Teacher Wanjiku", rating: 4, date: "2026-03-22", text: "Recommended to all my candidates. Vol. 2 on statistics can't come soon enough." },
  { id: "r8", bookSlug: "the-matatu-that-flew", name: "Auntie Rose", rating: 5, date: "2026-07-25", text: "My four-year-old now greets every matatu by name. We've read it forty times." },
  { id: "r9", bookSlug: "start-where-you-stand", name: "Dennis K.", rating: 4, date: "2026-06-08", text: "No motivational fluff — just systems that survived contact with my actual life. The chama chapter landed hard." },
  { id: "r10", bookSlug: "sermons-of-the-acacia", name: "Neema J.", rating: 5, date: "2026-02-17", text: "Read the title poem aloud at my grandfather's send-off. There was not a dry eye in Mnarani." },
  { id: "r11", bookSlug: "swahili-grammar-essentials", name: "Jonas P.", rating: 5, date: "2026-05-14", text: "Noun classes finally make sense. Learning Swahili from Berlin and this is my bible." },
  { id: "r12", bookSlug: "introduction-kenyan-constitutional-law-oer", name: "Lilian A.", rating: 5, date: "2026-08-20", text: "Free and better than some texts I paid KES 4,000 for. Every first-year should download this." },
];

// ---------------------------------------------------------------- blog
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tag: string;
  readMinutes: number;
  image: string;
  content: string; // markdown (##, >, -, **)
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ten-east-african-novels-before-the-rains-end",
    title: "Ten East African Novels to Read Before the Rains End",
    excerpt: "Our editors' seasonal reading list: five new releases and five modern classics from Kenya, Uganda and Tanzania.",
    date: "2026-09-21",
    author: "Ukweli Editors",
    tag: "Reading List",
    readMinutes: 8,
    image: "/images/blog-1.jpg",
    content: `The long rains are coming, and every reader knows what that means: permission to stay in. Here are the ten books our editors keep pressing into people's hands this season — five new releases we're proud to stock, and five modern classics every East African shelf deserves.

## The New Wave

**1. Beneath the Jacaranda Sky — Wanjiru Kamau.** A letter unsigned, three strangers, one city in full purple bloom. The warmest novel we've read this year.

**2. River of Ancestors — Baraka Mwangi.** One family, two centuries, the sea watching everything. Read it slowly, like the tide.

**3. The Nairobi Ledger — Wanjiru Kamau.** A second-hand ledger, a vanished judge, and a mystery that walks you through the city's archives.

**4. Caravan of Salt — Dr. Ochieng Odhiambo.** Non-fiction that reads like a novel: walking the old caravan routes with a historian who notices everything.

**5. Sermons of the Acacia — Baraka Mwangi.** Forty-two poems in English and Kiswahili. Keep it by the bed; open it like a tap.

## The Cornerstones

> A reading list without the classics is a house without a foundation.

**6. The river-between generation.** The mid-century novels that mapped the region's first literary borders — ask any Kenyan who read for KCSE.

**7. The Swahili coast canon.** From the *Utendi wa Mwana Kupona* translations forward, coastal literature is a library unto itself.

**8. Nyerere on education.** *Education for Self-Reliance* still starts arguments in staffrooms — the good kind.

**9. The Makerere poets.** The 1960s Kampala generation that proved East Africa would write its own tradition, not import one.

**10. The narrators.** From Equiano forward, African life-writing invented modern autobiography. Our free Ukweli Classics edition is the place to start.

## How to build the pile

Start with one new release and one cornerstone. Pair a novel with a book of poems — we promise the poems will be finished first, and then you'll go back for the novel with sharper ears. And when the rains arrive in earnest, come tell us on WhatsApp what you loved.`,
  },
  {
    slug: "review-beneath-the-jacaranda-sky",
    title: "Review: 'Beneath the Jacaranda Sky' by Wanjiru Kamau",
    excerpt: "Wanjiru Kamau's third novel is her most ambitious — a Nairobi story about inheritance, forgiveness and matatu economics. Four and a half stars.",
    date: "2026-09-05",
    author: "Rebecca M., Book Reviewer",
    tag: "Book Review",
    readMinutes: 6,
    image: "/images/blog-2.jpg",
    content: `There is a matatu in Wanjiru Kamau's new novel that deserves its own character page. Route 44, Nairobi-bound, radio stuck between two stations — and inside it, three strangers who will spend the next three hundred pages discovering they have been travelling together for twenty years.

## The setup

Mama Rotich sells tea at the stage and remembers everyone's order. Kevin is a forensic accountant running from a spreadsheet that ruined somebody's life. Zawadi sells flowers at the roundabout and can pitch-perfect any song the radio gives her. What joins them is a letter — unsigned, unsent, twenty years old — that surfaces in the novel's first chapter and refuses to sink again.

## What works

**The city.** Kamau writes Nairobi the way older Lagos writers wrote Lagos: as a character with moods. Traffic here isn't backdrop; it's fate with a conductor.

**The language.** Dialogue moves between English, Sheng and Kiswahili without italics or apology, and the rhythm is always right. Several matatu conversations in this book are funnier, and sadder, than entire novels.

**The restraint.** The letter's mystery could have powered a thriller. Instead Kamau lets it power conversations — about debt, grief, and the things we pass down unintentionally.

## What doesn't

The middle third sags slightly; a subplot about Kevin's employer feels imported from a leaner book. But the final hundred pages — a funeral, a flower stall, a rainstorm — earn it all back.

## Verdict

> Four and a half stars. The most generous Nairobi novel in years — generous to its characters, and to the reader.

**Beneath the Jacaranda Sky** is available now on Ukweli Books in PDF and EPUB, with the first ten pages free to preview.`,
  },
  {
    slug: "why-public-domain-african-classics-matter",
    title: "Why Public-Domain African Classics Matter in 2026",
    excerpt: "Free books aren't a marketing trick. They're the foundation of a reading culture — and East Africa's are underused. Here's our case.",
    date: "2026-08-18",
    author: "Ukweli Editors",
    tag: "African Literature",
    readMinutes: 7,
    image: "/images/blog-3.jpg",
    content: `Every month, thousands of readers download free titles from Ukweli: Equiano's *Narrative*, coastal folktales, KCSE revision packs, open textbooks. Some people ask us why we give away a third of our catalogue. The answer is simple: because a bookshop is not just a till. It's a door.

## The classics are load-bearing

The texts we call public-domain African classics did real work in the world. Equiano's 1789 *Narrative* helped end a trade in human beings. Nineteenth-century Swahili verse carried law, etiquette and faith across a whole coast. These are not museum pieces; they are load-bearing walls of modern African writing.

## Free is infrastructure

A student in Mandera has the same right to Equiano as a student in Mayfair. When we release a carefully re-typeset free edition — new introduction, clean typography, working table of contents — we're not destroying value. We're compounding it:

- **Teachers** can assign texts without photocopying contraband PDFs.
- **Parents** can stock a home library for KES 0.
- **Writers** can quote, translate and build on these works legally.

## The twenty-four we started with

Our free shelf mixes four kinds: African classics and folklore, government education materials (KCSE, PLE, CSEE revision), open academic papers from East African researchers, and original creative-commons titles like Grace Nakato's picture books.

> If you know a public-domain African text we should rescue, typeset and release — tell us. The shelf is never finished.

## Start here

New to the free shelf? Download *The Interesting Narrative of the Life of Olaudah Equiano* tonight. Then the *African Proverbs Treasury* for the family WhatsApp group. Then — when you're ready — come browse the paid shelves. That's the whole business model, honestly: read wonderful things free, then stay for more.`,
  },
];

// ---------------------------------------------------------------- community
export interface CommunityTile {
  image: string;
  quote: string;
  name: string;
  place: string;
}

export const COMMUNITY_TILES: CommunityTile[] = [
  { image: "/images/community-1.jpg", quote: "Finished 'Start Where You Stand' — the chama chapter changed how our savings group works.", name: "Doreen", place: "Nakuru" },
  { image: "/images/community-2.jpg", quote: "Sunday afternoon, a pot of tea, and Caravan of Salt. Perfect.", name: "Wycliffe", place: "Kisumu" },
  { image: "/images/community-3.jpg", quote: "Reading the Swahili Grammar between lectures. The noun-class chapter is genius.", name: "Asha", place: "Mombasa" },
  { image: "/images/community-4.jpg", quote: "My book club argued about Beneath the Jacaranda Sky till midnight. 10/10.", name: "Sharon", place: "Nairobi" },
  { image: "/images/community-5.jpg", quote: "Journaling through the Discipline of Small Wins workbook — day 34 and counting.", name: "Kelvin", place: "Eldoret" },
  { image: "/images/community-6.jpg", quote: "Found the free constitutional law text before my law school interview. Passed!", name: "Nabwire", place: "Kampala" },
];

export const MAX_DOWNLOADS_PER_PURCHASE = 5;
export const DOWNLOAD_LINK_DAYS = 7;

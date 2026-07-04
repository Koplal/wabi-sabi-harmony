export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQ content — single source of truth, imported by both FAQ.tsx (visible
 * accordion + FAQPageSchema) and scripts/prerender.ts (static FAQPage JSON-LD).
 * Keep visible and schema text identical by sourcing both from here.
 */
export const faqItems: FaqItem[] = [
  {
    question: "What makes Wabi Sabi Services different?",
    answer:
      "We blend the Japanese philosophy of wabi-sabi — finding beauty in simplicity and imperfection — with eco-luxury cleaning practices. Our mindful approach treats cleaning as a practice of creating calm, healthy living spaces rather than a chore to rush through. We use exclusively premium, non-toxic products and bring real intention to every surface we touch.",
  },
  {
    question: "Which areas of Victoria do you serve?",
    answer:
      "We bring mindful luxury cleaning throughout Greater Victoria, including Oak Bay & Fairfield, James Bay & Downtown Victoria, Saanich & Gordon Head, Esquimalt & View Royal, Langford & Colwood, Sidney & North Saanich, and Cadboro Bay & Cordova Bay. Travel fees may apply for locations beyond our standard service area.",
  },
  {
    question: "How do I book your services?",
    answer:
      "Booking is simple. Online: visit wabisabiservices.ca for 24/7 booking. Phone: call us at (250) 896-5971. Email: contact hello@wabisabiservices.ca. We recommend booking 48-72 hours in advance for single services and one week ahead for recurring services to ensure your preferred time slot.",
  },
  {
    question: "What's included in your Mindful Standard Clean?",
    answer:
      "Living spaces and bedrooms: mindful dusting of all surfaces, décor, and electronics; vacuuming with HEPA filtration; mopping hard floors with eco-luxury products; disinfecting light switches and door handles; cobweb and ceiling-fan dusting; attention to baseboards and window sills. Bathrooms: deep sanitization of toilets, tubs, showers, and sinks; polished fixtures; plant-based disinfecting; clean mirrors. Kitchen: sanitized countertops, exterior appliance cleaning, degreased stovetop, and polished stainless steel.",
  },
  {
    question: "What distinguishes your Deep Cleaning service?",
    answer:
      "Our Deep Clean includes everything in the Standard Clean plus detailed baseboards throughout, interior window cleaning (ground level), light fixture and ceiling fan deep cleaning, inside appliances (oven and refrigerator when empty), detailed grout and tile restoration, cleaning behind accessible furniture and appliances, and wall spot-cleaning. First-time clients who haven't had professional cleaning within 30 days should book our Deep Clean to establish a pristine baseline.",
  },
  {
    question: "Do you offer specialized services?",
    answer:
      "Yes. We provide eco-organization (3-hour minimum for mindful decluttering), post-construction cleaning, move-in/move-out cleaning, and seasonal deep cleans.",
  },
  {
    question: "How is pricing determined?",
    answer:
      "Pricing is tailored to your home and cadence — home size (square footage and number of rooms), number of bathrooms, service type (Standard, Deep, or Specialized), and frequency (weekly, bi-weekly, monthly, or one-time). We extend preferred rates for ongoing care plans, reflecting our commitment to discerning homes across Victoria, BC.",
  },
  {
    question: "What frequency should I choose?",
    answer:
      "Weekly suits busy families, pet owners, or those who value constant readiness. Bi-weekly is a graceful balance for most homes. Tri-weekly fits smaller spaces or minimalist households. Monthly maintains a baseline for tidy homes. One-time service is ideal for deep cleans or special occasions. Ongoing care plans receive preferred rates, tailored to your home and cadence.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Please provide 48 hours notice for cancellations or rescheduling to avoid a 50% service fee. Same-day cancellations incur the full service charge. This allows us to schedule fairly and honor our team's time.",
  },
  {
    question: "What cleaning products do you use?",
    answer:
      "We exclusively use eco-luxury cleaning products that are 100% non-toxic and biodegradable, plant-based and hypoallergenic, free from harsh chemicals, VOCs, and synthetic fragrances, and safe for children, pets, and sensitive individuals. We can also accommodate fragrance-free preferences.",
  },
  {
    question: "Are your services safe for my pets?",
    answer:
      "Absolutely. All our products are pet-safe, and our team is trained to work comfortably around animals. Please let us know about any pets during booking so we can prepare accordingly and respect their spaces.",
  },
  {
    question: "Are you insured and bonded?",
    answer:
      "Yes, Wabi Sabi Services is fully insured and bonded. All team members are background-checked and professionally trained. We treat your home with the same care and respect we give our own.",
  },
  {
    question: "How long will the cleaning take?",
    answer:
      "Duration varies by home size and service type: studio/1BR takes 1.5-2.5 hours, 2BR takes 2-3 hours, 3BR takes 2.5-4 hours, and 4BR+ takes 3-5 hours. Deep cleans require approximately 50% more time. We provide accurate estimates during booking.",
  },
  {
    question: "Do I need to be home during cleaning?",
    answer:
      "Not at all. Many clients prefer us to clean while they're at work or running errands. We're happy to work with lockbox codes, door codes, or hidden keys. For first-time services, some clients prefer to be home to show us around.",
  },
  {
    question: "Do I need to provide cleaning supplies?",
    answer:
      "No. We bring all professional-grade supplies and equipment. We only ask that you provide a vacuum if you have specific filtration needs (such as a pet-hair vacuum) and that your home has running water and electricity.",
  },
  {
    question: "How should I prepare for your visit?",
    answer:
      "Minimal preparation is needed: clear surfaces of personal items and clutter, secure pets or inform us of their location, note any areas requiring special attention, and remove valuable or fragile items from cleaning areas.",
  },
  {
    question: "What is your satisfaction guarantee?",
    answer:
      "If you're not completely happy with any aspect of our service, please contact us within 24 hours. We'll return to address any concerns at no additional charge.",
  },
  {
    question: "Can you accommodate special requests?",
    answer:
      "Absolutely. Whether you need fragrance-free products, have specific cleaning preferences, require accommodation for allergies, or have areas needing extra attention, just let us know. We customize our approach to your needs.",
  },
  {
    question: "Do you offer luxury cleaning in Oak Bay and Uplands?",
    answer:
      "Yes. Oak Bay and the Uplands — the Olmsted-designed National Historic Site garden suburb — are flagship areas for our bespoke concierge cleaning. We care for heritage and trophy estates with museum-level precision and discretion. Reach us at (250) 896-5971 or hello@wabisabiservices.ca to arrange care for your Victoria, BC home.",
  },
  {
    question: "Can you care for heritage homes and historic finishes?",
    answer:
      "Yes. We routinely care for Victoria's heritage residences — Maclure and Rattenbury homes, Tudor Revival estates, Craftsman and Edwardian properties. Our team treats cast limestone, marble, wrought iron, and heritage windows with material-aware methods that respect preservation requirements. Call (250) 896-5971 or email hello@wabisabiservices.ca to discuss your home's needs.",
  },
  {
    question: "Do you clean waterfront and salt-air estates?",
    answer:
      "Yes. Oceanfront homes in Ten Mile Point, Cadboro Bay, Cordova Bay, and along Lands End Road face extreme salt-spray that degrades marble, limestone, and view-glass. We provide ongoing salt-air remediation and floor-to-ceiling glazing care. Contact us at (250) 896-5971 or hello@wabisabiservices.ca in Victoria, BC.",
  },
  {
    question: "Do you offer concierge care for absentee and second-home owners?",
    answer:
      "Yes. For absentee and second-home owners across North Saanich, Sidney, Broadmead, and beyond, we offer discreet key-holding, absence management, and turnover preparation between visits. Your estate stays pristine and ready. Arrange tailored concierge care by calling (250) 896-5971 or emailing hello@wabisabiservices.ca in Victoria, BC.",
  },
  {
    question: "Are your staff vetted and discreet enough for high-value estates?",
    answer:
      "Yes. Every team member is background-checked, professionally trained, fully insured and bonded, and accustomed to the discretion that high-value and nationally-historic estates require. We bring quiet, vetted professionalism to your home. Speak with us at (250) 896-5971 or hello@wabisabiservices.ca, serving Victoria, BC.",
  },
  {
    question: "Which luxury neighbourhoods near me do you serve?",
    answer:
      "We serve Greater Victoria's most discerning enclaves — Uplands, Oak Bay, Rockland, Ten Mile Point, Cadboro Bay, Willis Point, North Saanich, and more. Explore the full list on our service areas page at /areas, or reach us at (250) 896-5971 or hello@wabisabiservices.ca in Victoria, BC.",
  },
  {
    question: "Do you clean luxury condos Downtown and in James Bay?",
    answer:
      "Yes. We provide white-glove care for lock-and-leave residences in Downtown Victoria's heritage conversions and towers, and in James Bay — the oldest residential neighbourhood in BC. Marble baths, granite, and floor-to-ceiling glass are our specialty. Reach us at (250) 896-5971 or hello@wabisabiservices.ca, Victoria, BC.",
  },
  {
    question: "Can you handle very large estate homes?",
    answer:
      "Yes. We regularly care for expansive estates of 7,000-plus square feet with guest houses, in Uplands, North Saanich, Dean Park, and Willis Point. Our team scales thoughtfully to homes of any size while maintaining museum-level detail. Call (250) 896-5971 or email hello@wabisabiservices.ca to discuss your Victoria, BC estate.",
  },
];

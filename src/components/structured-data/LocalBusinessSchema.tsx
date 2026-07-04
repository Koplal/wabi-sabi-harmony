import { JsonLd } from "./JsonLd";

/**
 * Single co-typed Organization + LocalBusiness node for Wabi Sabi Services.
 * Helps with local SEO and "near me" searches in Victoria, BC.
 *
 * This is the only org node rendered at runtime (OrganizationSchema is no longer
 * mounted). It mirrors prerender.ts orgGraph() so the runtime and static markup
 * resolve to one identical entity under @id "...#organization".
 */
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": "https://wabisabiservices.ca/#organization",
    "name": "Wabi Sabi Services",
    "description": "Quiet luxury, immaculately kept. Mindful cleaning for intentional homes and businesses in Victoria, BC. Museum-level precision, discreet service, sustainable care.",
    "url": "https://wabisabiservices.ca",
    "logo": "https://wabisabiservices.ca/og-image.png",
    "image": "https://wabisabiservices.ca/og-image.png",
    "telephone": "+1-250-896-5971",
    "email": "hello@wabisabiservices.ca",
    "priceRange": "$$-$$$",
    "sameAs": [
      "https://www.instagram.com/wabisabiservices/",
      "https://share.google/qpmn3a6VHcDFweao6"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Victoria",
      "addressRegion": "BC",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "48.4284",
      "longitude": "-123.3656"
    },
    "areaServed": [
      { "@type": "Place", "name": "Greater Victoria, BC" },
      { "@type": "Place", "name": "Saanich Peninsula, BC" },
      { "@type": "Place", "name": "Westshore / Langford, BC" },
      { "@type": "Place", "name": "Uplands, Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.4480", "longitude": "-123.2980" } },
      { "@type": "Place", "name": "Oak Bay, Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.4262", "longitude": "-123.3120" } },
      { "@type": "Place", "name": "Rockland, Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.4220", "longitude": "-123.3440" } },
      { "@type": "Place", "name": "Ten Mile Point, Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.4630", "longitude": "-123.2740" } },
      { "@type": "Place", "name": "Cadboro Bay, Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.4560", "longitude": "-123.2920" } },
      { "@type": "Place", "name": "North Saanich, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.6590", "longitude": "-123.4150" } },
      { "@type": "Place", "name": "Willis Point, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.5470", "longitude": "-123.4760" } },
      { "@type": "Place", "name": "Fairfield, Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.4160", "longitude": "-123.3460" } },
      { "@type": "Place", "name": "Gordon Head, Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.4730", "longitude": "-123.3120" } },
      { "@type": "Place", "name": "Broadmead, Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.4870", "longitude": "-123.3690" } },
      { "@type": "Place", "name": "Cordova Bay, Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.5130", "longitude": "-123.3760" } },
      { "@type": "Place", "name": "Dean Park, North Saanich, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.6310", "longitude": "-123.4250" } },
      { "@type": "Place", "name": "Prospect Lake, Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.5170", "longitude": "-123.4470" } },
      { "@type": "Place", "name": "Sidney, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.6506", "longitude": "-123.3986" } },
      { "@type": "Place", "name": "Metchosin, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.3810", "longitude": "-123.5360" } },
      { "@type": "Place", "name": "James Bay, Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.4150", "longitude": "-123.3720" } },
      { "@type": "Place", "name": "Downtown Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.4284", "longitude": "-123.3656" } },
      { "@type": "Place", "name": "Gonzales, Victoria, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.4110", "longitude": "-123.3210" } },
      { "@type": "Place", "name": "Bear Mountain, Langford, BC", "geo": { "@type": "GeoCoordinates", "latitude": "48.4640", "longitude": "-123.5260" } }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": "+1-250-896-5971",
      "email": "hello@wabisabiservices.ca",
      "availableLanguage": ["English"]
    }
  };

  return <JsonLd data={schema} />;
};


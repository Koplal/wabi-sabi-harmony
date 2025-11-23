import { JsonLd } from "./JsonLd";

/**
 * Organization schema for Wabi Sabi Services.
 * Provides Google with official business information.
 */
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://wabisabiservices.ca/#organization",
    "name": "Wabi Sabi Services",
    "url": "https://wabisabiservices.ca",
    "logo": "https://wabisabiservices.ca/og-image.png",
    "description": "Mindful luxury cleaning services in Victoria, BC. Museum-level precision, discreet service, and sustainable care for intentional homes and businesses.",
    "email": "hello@wabisabiservices.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Victoria",
      "addressRegion": "BC",
      "addressCountry": "CA"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "hello@wabisabiservices.com",
      "availableLanguage": ["English"]
    }
  };

  return <JsonLd data={schema} />;
};


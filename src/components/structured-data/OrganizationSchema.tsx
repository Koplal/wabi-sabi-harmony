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
    "email": "hello@wabisabiservices.ca",
    "telephone": "+1-250-896-5971",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Victoria",
      "addressRegion": "BC",
      "addressCountry": "CA"
    },
    "sameAs": [
      "https://www.instagram.com/wabisabiservices/",
      "https://share.google/qpmn3a6VHcDFweao6"
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


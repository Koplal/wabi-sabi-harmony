import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  publishedTime?: string;
  keywords?: string;
}

/**
 * SEO component for managing meta tags dynamically across pages.
 * 
 * @param title - Page title (will be appended with site name)
 * @param description - Page meta description
 * @param canonical - Canonical URL for the page
 * @param ogType - Open Graph type (website or article)
 * @param ogImage - Open Graph image URL
 * @param publishedTime - Article published time (ISO format)
 * @param keywords - Page keywords for SEO
 */
export const SEO = ({
  title,
  description,
  canonical = "",
  ogType = "website",
  ogImage = "/og-image.png",
  publishedTime,
  keywords,
}: SEOProps) => {
  const siteUrl = "https://wabisabiservices.ca";
  const fullTitle = `${title} | Wabi Sabi Services`;
  const canonicalUrl = canonical || siteUrl + window.location.pathname;
  const fullImageUrl = ogImage.startsWith("http") ? ogImage : siteUrl + ogImage;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:locale" content="en_CA" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
};


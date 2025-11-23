import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  data: Record<string, any>;
}

/**
 * Component to inject JSON-LD structured data into the page head.
 * Used as a base for all schema components.
 */
export const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};


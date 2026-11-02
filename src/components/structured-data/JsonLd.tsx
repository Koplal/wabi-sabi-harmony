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
        {/* schema.org guidance: a "<" must not end the script early in the built page. */}
        {JSON.stringify(data).replace(/</g, "\\u003c")}
      </script>
    </Helmet>
  );
};


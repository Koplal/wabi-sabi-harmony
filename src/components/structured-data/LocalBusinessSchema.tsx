import { ORGANIZATION } from "@/data/organization";
import { JsonLd } from "./JsonLd";

/**
 * Single co-typed Organization + LocalBusiness node for Wabi Sabi Services.
 * Helps with local SEO and "near me" searches in Victoria, BC.
 *
 * This is the only org node rendered at runtime (OrganizationSchema is no longer
 * mounted). scripts/prerender.ts writes the same data into the static head, so
 * both resolve to one identical entity under @id "...#organization".
 */
export const LocalBusinessSchema = () => <JsonLd data={ORGANIZATION} />;

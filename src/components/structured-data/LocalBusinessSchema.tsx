import { ORGANIZATION } from "@/data/organization";
import { JsonLd } from "./JsonLd";

/**
 * Single co-typed Organization + LocalBusiness node for Wabi Sabi Services.
 * Helps with local SEO and "near me" searches in Victoria, BC.
 *
 * This is the only org node (OrganizationSchema is no longer mounted). Layout
 * renders it on every page, under @id "...#organization".
 */
export const LocalBusinessSchema = () => <JsonLd data={ORGANIZATION} />;

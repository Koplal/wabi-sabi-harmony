import { PARENT_ORGANIZATION } from "@/data/organization";
import { JsonLd } from "./JsonLd";

/**
 * The parent company node, for the home page only. Mount it in Home.tsx, inside
 * the lazy chunk. LocalBusinessSchema renders before the lazy page suspends, and
 * the head manager keeps a node from a discarded render, so a pathname check
 * there would leak this node onto later pages.
 */
export const ParentOrganizationSchema = () => <JsonLd data={PARENT_ORGANIZATION} />;

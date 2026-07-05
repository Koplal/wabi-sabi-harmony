import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbCrumb {
  /** Visible label. */
  name: string;
  /** Crumb target. Absolute site URLs (as used by BreadcrumbSchema) are accepted and normalized to a router path. */
  url: string;
}

interface BreadcrumbsProps {
  /** Ordered trail from Home to the current page. The last item renders as the current (non-link) page. */
  items: BreadcrumbCrumb[];
  /** Center the trail (for use inside a centered hero). Defaults to a left-aligned top bar. */
  centered?: boolean;
  className?: string;
}

/** Strip the site origin so absolute BreadcrumbSchema URLs can be reused as router paths. */
const toPath = (href: string) => href.replace(/^https?:\/\/[^/]+/, "") || "/";

/**
 * Visible breadcrumb trail, mirroring the BreadcrumbList JSON-LD each page emits.
 * Renders a single `nav[aria-label="Breadcrumb"]` landmark; the current page is
 * marked with aria-current and is not a link.
 */
export const Breadcrumbs = ({ items, centered = false, className }: BreadcrumbsProps) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(centered ? "mb-8" : "container mx-auto px-6 lg:px-12 pt-6", className)}
    >
      <ol
        className={cn(
          "flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
          centered && "justify-center"
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={item.url}>
              <li>
                {isLast ? (
                  <span aria-current="page" className="text-foreground">
                    {item.name}
                  </span>
                ) : (
                  <Link to={toPath(item.url)} className="hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className="flex items-center">
                  <ChevronRight className="h-3 w-3" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

const LINK = "underline hover:text-primary transition-colors";

/**
 * In each form's built HTML, because the send button stays disabled until the page's scripts run.
 * If they never do, this line still tells the visitor how else to reach us.
 */
export function FormHelp() {
  return (
    <p className="text-xs text-muted-foreground mt-4">
      If this form isn't working, call{" "}
      <a href="tel:+12508965971" className={LINK}>250-896-5971</a> or email{" "}
      <a href="mailto:hello@wabisabiservices.ca" className={LINK}>hello@wabisabiservices.ca</a>.
    </p>
  );
}

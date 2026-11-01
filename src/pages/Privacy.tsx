import type { ReactNode } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";

/** Written at sign-off. The "Last updated" line stays hidden while this is empty. */
const LAST_UPDATED: string = "November 1, 2026";

const SECTION = "space-y-4";
const H2 = "text-3xl font-serif mb-4";
const UL = "list-disc pl-6 space-y-2";
const LINK = "text-primary underline hover:opacity-70 transition-opacity";

const ExternalLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
    {children}
  </a>
);

const Privacy = () => (
  <Layout>
    <SEO
      title="Privacy Policy"
      description="How Wabi Sabi Services handles your personal information when you contact us, book a service or visit wabisabiservices.ca."
      canonical="https://wabisabiservices.ca/privacy"
    />
    <BreadcrumbSchema
      items={[
        { name: "Home", url: "https://wabisabiservices.ca/" },
        { name: "Privacy Policy", url: "https://wabisabiservices.ca/privacy" },
      ]}
    />
    <Breadcrumbs
      items={[
        { name: "Home", url: "https://wabisabiservices.ca/" },
        { name: "Privacy Policy", url: "https://wabisabiservices.ca/privacy" },
      ]}
    />
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl font-serif mb-4">Privacy Policy</h1>
        {LAST_UPDATED && <p className="text-muted-foreground">Last updated: {LAST_UPDATED}</p>}
      </header>

      <div className="space-y-8">
        <section className={SECTION}>
          <p>
            Wabi Sabi Services ("we", "us") is a luxury cleaning, organizing, and household concierge company in
            Victoria, British Columbia. This policy explains what personal information we collect through
            wabisabiservices.ca and when you contact or book with us, why we collect it, who we share it with, and the
            choices you have. We follow British Columbia's Personal Information Protection Act (PIPA).
          </p>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>What we collect</h2>
          <ul className={UL}>
            <li>
              <strong>Contact form:</strong> your name, email, phone number, address, service type, cadence, and any
              notes you add.
            </li>
            <li>
              <strong>Booking form:</strong> your name, email, phone number, address, service type, cadence, and
              preferred times.
            </li>
            <li>
              <strong>Careers form:</strong> your name, email, phone number, the position you're interested in, your
              experience, your availability, and your message.
            </li>
            <li>
              <strong>Seasonal checkout:</strong> your name, email, phone number, address, city, and postal code. At
              seasonal checkout, your billing address and card details are entered on Stripe's page, never on this
              site.
            </li>
            <li>
              <strong>When you become a client:</strong> your signed agreement, access details such as door codes,
              lockbox or key arrangements, pet and home notes, any before-and-after photos you permit, and a credit card
              kept on file for bookings.
            </li>
            <li>
              <strong>When you call or email us:</strong> your contact details and what you tell us.
            </li>
            <li>
              <strong>Automatically when you visit the site:</strong> pages viewed, links clicked, device and browser
              type, approximate location (city level), how you arrived (for example, a Google search), and cookie or
              similar identifiers. See "Analytics" below.
            </li>
          </ul>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>How we use it</h2>
          <ul className={UL}>
            <li>To prepare estimates, schedule and deliver our services, and follow up about your service.</li>
            <li>To answer your questions and keep records of our work.</li>
            <li>To send service messages (confirmations, reminders, invoices).</li>
            <li>To review job applications.</li>
            <li>To understand how people use our website and improve it.</li>
          </ul>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>Analytics</h2>
          <p>We use the following tools on wabisabiservices.ca:</p>
          <ul className={UL}>
            <li>
              <strong>Google Analytics</strong> measures how visitors use the site.
            </li>
            <li>
              <strong>Vercel Analytics and Speed Insights</strong> measure site usage and performance.
            </li>
            <li>
              <strong>Microsoft Clarity</strong> records how visitors use our pages (clicks, scrolling and mouse
              movement) to produce heatmaps and session replays that help us improve the site. Text you type into forms
              is masked before it leaves your browser. Microsoft's privacy statement:{" "}
              <ExternalLink href="https://privacy.microsoft.com/privacystatement">
                privacy.microsoft.com/privacystatement
              </ExternalLink>
              . Clarity uses first- and third-party cookies (such as _clck and _clsk) and similar technologies, and
              Microsoft may also use this data as described in its privacy statement, including for advertising.
            </li>
          </ul>
          <p>These tools use cookies and similar technologies. You can:</p>
          <ul className={UL}>
            <li>
              Opt out of Google Analytics with the browser add-on at{" "}
              <ExternalLink href="https://tools.google.com/dlpage/gaoptout">
                tools.google.com/dlpage/gaoptout
              </ExternalLink>
              .
            </li>
            <li>Block or delete cookies in your browser settings.</li>
          </ul>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>Who we share it with</h2>
          <p>
            We don't sell your personal information. We share it with the service providers who help us run the
            business, including those listed below, and with partners we arrange for you.
          </p>
          <ul className={UL}>
            <li>
              <strong>Stripe</strong> processes payments at seasonal checkout and keeps your order details, including
              your name, email, phone number and address.
            </li>
            <li>
              <strong>Google</strong> provides Analytics and web fonts.
            </li>
            <li>
              <strong>Vercel</strong> hosts the website, runs our forms and checkout, and measures site performance and
              usage.
            </li>
            <li>
              <strong>Resend</strong> delivers the emails our forms send.
            </li>
            <li>
              <strong>Microsoft</strong> provides Clarity (site-usage analytics).
            </li>
          </ul>
          <p>Partners we arrange for you, such as exterior window cleaners, receive the details needed to do that work.</p>
          <p>
            Some of these providers store information outside Canada, including in the United States, where it may be
            subject to local laws.
          </p>
          <p>We may also disclose information if the law requires it.</p>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>How long we keep it</h2>
          <p>
            We keep booking and billing records for six years from the end of the tax year they relate to, in line with
            Canada Revenue Agency record-keeping requirements. We keep other client details, including access details,
            only as long as we need them to serve you. We keep inquiries that don't lead to a booking, and job
            applications, for one year.
          </p>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>How we protect it</h2>
          <p>
            Access to client information is limited to the people who need it to do their jobs. We use reputable
            providers with security safeguards. No system is perfectly secure, so please contact us right away if you
            think your information has been misused.
          </p>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>Your choices and rights</h2>
          <p>
            You can ask to see the personal information we hold about you, ask us to correct it, or withdraw your consent
            at any time. You can also ask us to delete information we no longer need. We'll respond within 30 days. If
            you're not satisfied with our response, you can contact the Office of the Information and Privacy
            Commissioner for British Columbia (<ExternalLink href="https://www.oipc.bc.ca">oipc.bc.ca</ExternalLink>).
          </p>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>Contact us</h2>
          <p>Privacy questions or requests:</p>
          <address className="not-italic">
            <p className="mb-2">Privacy Officer: Jalene Plamondon, Wabi Sabi Services</p>
            <p className="mb-2">
              Email:{" "}
              <a href="mailto:hello@wabisabiservices.ca" className={LINK}>
                hello@wabisabiservices.ca
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:+12508965971" className={LINK}>
                (250) 896-5971
              </a>
            </p>
          </address>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>Changes to this policy</h2>
          <p>We'll post any changes on this page and update the "Last updated" date.</p>
        </section>
      </div>
    </div>
  </Layout>
);

export default Privacy;

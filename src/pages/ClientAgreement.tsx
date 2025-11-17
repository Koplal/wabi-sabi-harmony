import { Layout } from "@/components/Layout";

export default function ClientAgreement() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif mb-4">Wabi Sabi Services</h1>
        <h2 className="text-2xl font-serif mb-2">Client Care Agreement</h2>
        <p className="text-muted-foreground mb-2">Effective Date: November 1st, 2025</p>
        <p className="text-muted-foreground mb-12">Servicing Area: Greater Victoria, BC</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-serif mb-4">1. Welcome</h2>
            <p>
              Thank you for choosing Wabi Sabi Services. These guidelines outline how we work, what you can expect from us, 
              and what we need in order to provide consistent, high-quality service. This is a living document and may be 
              updated as the business grows.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">2. Scheduling & Arrival Window</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Services take place Monday–Friday between 8:00 AM – 6:00 PM unless otherwise agreed upon.</li>
              <li>You'll receive email and/or text reminders before each visit.</li>
              <li>Arrival times are given in a 2-hour window based on route + traffic.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">3. Cancellations & Rescheduling</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>48+ hrs notice:</strong> No charge</li>
              <li><strong>Less than 48 hrs notice:</strong> 50% of scheduled service</li>
              <li><strong>Lockout / unable to access home:</strong> 50% of scheduled service</li>
            </ul>
            <p className="mt-4">All schedule changes must be made through the main contact number or email.</p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">4. Access to Your Home</h2>
            <p>Choose one:</p>
            <ol className="list-decimal pl-6 space-y-2 mt-3">
              <li>You are home to let us in</li>
              <li>Door or garage code provided in advance</li>
              <li>Lockbox with key on site</li>
            </ol>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">5. Service Pricing & Payment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payment due upon invoice by e-transfer, card, or bank transfer.</li>
              <li>Outstanding balances must be cleared before future bookings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">6. Preparing for Your Cleaning</h2>
            <p>To help us work efficiently:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Clear counters + remove loose items where possible</li>
              <li>Secure fragile or sentimental objects</li>
              <li>Place fresh bedding out if linen change is requested</li>
              <li>Pets that are reactive to strangers or equipment should be secured in another room</li>
            </ul>
            <p className="mt-4">Light surface clutter is fine — deep organizing can be booked as a separate service.</p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">7. What We Do / Do Not Move</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not move heavy furniture, appliances, or items attached to walls.</li>
              <li>We clean from the floor or a step stool only (no ladders, no climbing on counters).</li>
            </ul>
            <p className="mt-4">If you want behind or under furniture cleaned, please move it before service.</p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">8. Supplies & Equipment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We provide all products + equipment unless otherwise arranged.</li>
              <li>Please ensure a toilet brush is available in each bathroom.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">9. Breakage & Liability</h2>
            <p>
              We are insured and treat your home with care. If something is accidentally damaged, we will report it immediately 
              and discuss repair or replacement.
            </p>
            <p className="mt-4">We are not liable for:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Pre-existing damage</li>
              <li>Unstable or improperly secured items (floating shelves, loose frames, etc.)</li>
              <li>Items of high sentimental or irreplaceable value — please store these prior to service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">10. Privacy & Confidentiality</h2>
            <p>
              Your home and information are always kept confidential. We do not share client details, access codes, or photos 
              without written permission. Optional before/after photos exclude identifying features.
            </p>
          </section>

          <section className="bg-muted/30 p-6 rounded-lg">
            <h2 className="text-3xl font-serif mb-4">12. Agreement</h2>
            <p className="mb-6">
              By signing below, you confirm that you have read and agree to these guidelines and understand that continued use 
              of service implies acceptance of policy updates.
            </p>
            
            <div className="space-y-6 border-t pt-6">
              <div>
                <p className="font-semibold mb-2">Client Name:</p>
                <div className="border-b border-border pb-2">_____________________________________________________________</div>
              </div>

              <div>
                <p className="font-semibold mb-2">Address:</p>
                <div className="border-b border-border pb-2">_________________________________________________________________</div>
              </div>

              <div>
                <p className="font-semibold mb-2">Email / Phone:</p>
                <div className="border-b border-border pb-2">_________________________________________________________________</div>
              </div>

              <div>
                <p className="font-semibold mb-2">Signature:</p>
                <div className="border-b border-border pb-2">_________________________________________________________________</div>
              </div>

              <div>
                <p className="font-semibold mb-2">Date:</p>
                <div className="border-b border-border pb-2">______ / ______ / __________</div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <p className="font-semibold mb-4">Service Provider:</p>
                <p className="mb-2">Jalene Plamondon, Wabi Sabi Services</p>
                
                <div className="mt-4">
                  <p className="font-semibold mb-2">Signature:</p>
                  <div className="border-b border-border pb-2">_________________________________________________________________</div>
                </div>

                <div className="mt-4">
                  <p className="font-semibold mb-2">Date:</p>
                  <div className="border-b border-border pb-2">______ / ______ / __________</div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This is a display version of the agreement. For an official copy to sign, please contact us directly.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}

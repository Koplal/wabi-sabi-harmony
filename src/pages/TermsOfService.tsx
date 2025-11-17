import { Layout } from "@/components/Layout";

export default function TermsOfService() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif mb-4">Wabi Sabi Services Inc.</h1>
        <h2 className="text-2xl font-serif mb-2">Client Care Agreement & Terms of Service</h2>
        <p className="text-muted-foreground mb-12">Effective Date: November 2024</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-serif mb-4">1. Introduction</h2>
            <p>
              Welcome to Wabi Sabi Services Inc. ("Company", "we", "us", "our"). By booking our mindful luxury cleaning services, 
              you ("Client", "you", "your") agree to these Terms of Service. We reserve the right to update these terms at any time. 
              Your continued use of our services constitutes acceptance of any modifications.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">2. Our Service Philosophy</h2>
            <p>
              Wabi Sabi Services embraces the Japanese philosophy of finding beauty in imperfection and accepting the natural cycle 
              of growth and decay. We provide mindful, eco-conscious cleaning services that respect your home, health, and the environment. 
              Our approach combines meticulous attention to detail with sustainable practices.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">3. Services Offered</h2>
            <p>We offer the following cleaning services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Standard Cleaning:</strong> Regular maintenance cleaning for homes</li>
              <li><strong>Deep Cleaning:</strong> Comprehensive cleaning including baseboards, light fixtures, and detailed areas</li>
              <li><strong>Move-In/Move-Out Cleaning:</strong> Thorough cleaning for vacant properties</li>
              <li><strong>Post-Construction Cleaning:</strong> Specialized cleaning after renovations</li>
              <li><strong>Eco-Luxury Packages:</strong> Premium services using exclusively organic, non-toxic products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">4. Booking and Scheduling</h2>
            
            <h3 className="text-2xl font-serif mb-3 mt-6">4.1 Booking Process</h3>
            <p>
              Services can be booked through our website, by phone, or email. All bookings require accurate information about 
              your property size, condition, and specific cleaning needs.
            </p>

            <h3 className="text-2xl font-serif mb-3 mt-6">4.2 Arrival Window</h3>
            <p>
              Our team operates within a 60-minute arrival window of your scheduled time. We will notify you of any delays 
              exceeding this window.
            </p>

            <h3 className="text-2xl font-serif mb-3 mt-6">4.3 Access to Property</h3>
            <p>
              You must provide secure access to your property. Options include being present, providing a key/code, or using a lockbox. 
              If we cannot access your property, a lockout fee equal to 50% of the service cost will apply.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">5. Pricing and Payment</h2>
            
            <h3 className="text-2xl font-serif mb-3 mt-6">5.1 Pricing Structure</h3>
            <p>Pricing is based on property size, service type, and frequency:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Weekly Service:</strong> Best rate for regular maintenance</li>
              <li><strong>Bi-Weekly Service:</strong> Every two weeks</li>
              <li><strong>Monthly Service:</strong> Every four weeks</li>
              <li><strong>One-Time Service:</strong> Single cleaning at premium rate</li>
            </ul>

            <h3 className="text-2xl font-serif mb-3 mt-6">5.2 Payment Methods</h3>
            <p>
              We accept credit cards, debit cards, and e-transfers. Payment is due upon booking for first-time clients and 
              on the day of service for regular clients.
            </p>

            <h3 className="text-2xl font-serif mb-3 mt-6">5.3 Price Adjustments</h3>
            <p>
              Prices may be adjusted if the actual time required differs significantly from the estimate due to undisclosed conditions. 
              We will notify you before proceeding with any price changes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">6. Cancellation and Rescheduling</h2>
            
            <h3 className="text-2xl font-serif mb-3 mt-6">6.1 Client Cancellations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>48+ hours notice:</strong> No charge</li>
              <li><strong>24-48 hours notice:</strong> 50% cancellation fee</li>
              <li><strong>Less than 24 hours:</strong> Full service charge</li>
            </ul>

            <h3 className="text-2xl font-serif mb-3 mt-6">6.2 Rescheduling</h3>
            <p>
              Services may be rescheduled once without penalty if done 24+ hours in advance. Subsequent rescheduling may incur fees.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">7. Quality Guarantee</h2>
            <p>
              We stand behind our work. If you're not satisfied with any aspect of our service, notify us within 24 hours with 
              specific concerns and photos if applicable. We will return within 48 hours to address the issues at no additional charge. 
              This guarantee applies only to areas cleaned during the original service.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">8. Health and Safety</h2>
            
            <h3 className="text-2xl font-serif mb-3 mt-6">8.1 COVID-19 and Illness Protocol</h3>
            <p>
              Please inform us if anyone in your household has symptoms of illness or has been exposed to communicable diseases. 
              We reserve the right to postpone service to protect our team and other clients.
            </p>

            <h3 className="text-2xl font-serif mb-3 mt-6">8.2 Eco-Friendly Products</h3>
            <p>
              We use non-toxic, biodegradable cleaning products. If you have specific allergies or sensitivities, please inform us. 
              You may also provide your own products for us to use.
            </p>

            <h3 className="text-2xl font-serif mb-3 mt-6">8.3 Safety Limitations</h3>
            <p>
              Our team cannot: work above 2 ladder steps, move heavy furniture (over 25 lbs), handle hazardous materials, 
              clean biohazards, or work in unsafe conditions.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">9. Property and Liability</h2>
            
            <h3 className="text-2xl font-serif mb-3 mt-6">9.1 Valuables</h3>
            <p>
              Please secure all valuables, cash, and jewelry. While our team is thoroughly vetted and insured, we recommend 
              storing valuable items safely.
            </p>

            <h3 className="text-2xl font-serif mb-3 mt-6">9.2 Insurance Coverage</h3>
            <p>
              We carry comprehensive general liability insurance. In the unlikely event of damage, we will assess and handle 
              claims promptly and professionally.
            </p>

            <h3 className="text-2xl font-serif mb-3 mt-6">9.3 Pre-existing Damage</h3>
            <p>
              We are not responsible for pre-existing damage, wear and tear, or damage caused by defective materials or improper 
              installation. Please inform us of any fragile or damaged items before service.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">10. Client Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide a safe, accessible working environment</li>
              <li>Secure pets during service</li>
              <li>Remove excessive clutter to allow proper cleaning</li>
              <li>Provide accurate information about property condition and special requirements</li>
              <li>Ensure adequate lighting, water, and electricity are available</li>
              <li>Notify us of any hazardous conditions or materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">11. Privacy and Confidentiality</h2>
            <p>
              We respect your privacy. All client information, access codes, and details about your property are kept strictly 
              confidential. We will never share your information with third parties without your explicit consent. Any photos taken 
              for quality control or marketing purposes require your written permission.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">12. Dispute Resolution</h2>
            <p>
              In the event of any disagreement, we encourage open communication to resolve issues amicably. If a resolution cannot 
              be reached, both parties agree to pursue mediation before any legal action. All disputes will be governed by the laws 
              of British Columbia, Canada.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">13. Termination</h2>
            <p>
              Either party may terminate regular cleaning services with 14 days written notice. Outstanding balances must be paid 
              before termination is finalized. We reserve the right to refuse or terminate service if client behavior is abusive, 
              threatening, or creates unsafe working conditions.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-4">14. Limitation of Liability</h2>
            <p>
              Our total liability for any claim arising from our services shall not exceed the amount paid for the specific service 
              in question. We are not liable for indirect, consequential, or incidental damages.
            </p>
          </section>

          <section className="bg-muted/30 p-6 rounded-lg">
            <h2 className="text-3xl font-serif mb-4">Contact Information</h2>
            <p className="mb-2"><strong>Wabi Sabi Services Inc.</strong></p>
            <p className="mb-2">Greater Victoria, BC</p>
            <p className="mb-2">Email: <a href="mailto:info@wabisabiservices.ca" className="text-primary hover:underline">info@wabisabiservices.ca</a></p>
            <p>By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}

import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Heart, Shield, Leaf, Users, Award } from "lucide-react";

export default function KeyTakeaways() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif mb-4">Why Choose Wabi Sabi Services</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Key Takeaways: Mindful Luxury Cleaning
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-serif mb-4">Our Philosophy: Mindful Luxury Cleaning</h2>
            <p className="text-lg text-muted-foreground">
              At Wabi Sabi Services, we transform the ordinary act of cleaning into an extraordinary experience. 
              Inspired by the Japanese aesthetic of finding beauty in simplicity, we bring intention and care to every home we touch.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-6">🌿 5 Pillars of Our Service</h2>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    1. Eco-Luxury Without Compromise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>100% non-toxic, biodegradable products</li>
                    <li>Premium quality that matches or exceeds conventional cleaners</li>
                    <li>Safe for children, pets, and sensitive individuals</li>
                    <li>Zero environmental guilt, maximum cleaning power</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    2. Mindful Attention to Detail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>Trained professionals who see cleaning as an art</li>
                    <li>Systematic approach ensuring nothing is overlooked</li>
                    <li>Respect for your space and belongings</li>
                    <li>Creating harmony, not just cleanliness</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    3. Transparent, Fair Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>No hidden fees or surprise charges</li>
                    <li>Clear quotes before you book</li>
                    <li>Flexible service packages to fit your budget</li>
                    <li>Best value through regular service discounts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    4. Reliability You Can Trust
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>Fully insured and bonded</li>
                    <li>Background-checked, trained professionals</li>
                    <li>Consistent quality standards</li>
                    <li>24-hour satisfaction guarantee</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    5. Personalized Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>Customized cleaning plans for your unique needs</li>
                    <li>Flexible scheduling that works for you</li>
                    <li>Special accommodation for allergies and preferences</li>
                    <li>Building long-term relationships, not just transactions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-6">✨ What Sets Us Apart</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Traditional Cleaning</th>
                    <th className="text-left py-3 px-4 font-semibold">Wabi Sabi Services</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">Rush through tasks</td>
                    <td className="py-3 px-4">Mindful, thorough approach</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Harsh chemicals</td>
                    <td className="py-3 px-4">Eco-luxury products</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">One-size-fits-all</td>
                    <td className="py-3 px-4">Customized service plans</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Just clean surfaces</td>
                    <td className="py-3 px-4">Create peaceful sanctuaries</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Transaction-focused</td>
                    <td className="py-3 px-4">Relationship-based</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-6">📊 By The Numbers</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Eco-friendly products</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">24-hour</div>
                  <div className="text-sm text-muted-foreground">Satisfaction guarantee</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">10+ years</div>
                  <div className="text-sm text-muted-foreground">Combined team experience</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">5-star</div>
                  <div className="text-sm text-muted-foreground">Average client rating</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">90%</div>
                  <div className="text-sm text-muted-foreground">Client retention rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">Zero</div>
                  <div className="text-sm text-muted-foreground">Environmental compromise</div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-6">💚 Our Commitment to You</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quality Promise</CardTitle>
                </CardHeader>
                <CardContent>
                  Every service backed by our 24-hour satisfaction guarantee. If you're not completely happy, we'll make it right.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Environmental Pledge</CardTitle>
                </CardHeader>
                <CardContent>
                  We're committed to protecting your health and our planet. Every product, every practice, every day.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  Proudly serving Greater Victoria with local employment and community investment.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Continuous Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  Regular training and education ensure we're always improving our service and sustainability practices.
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-6">🎯 Perfect For</h2>
            
            <ul className="grid md:grid-cols-2 gap-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span><strong>Busy Professionals</strong> who value their time and peace of mind</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span><strong>Families</strong> wanting a healthy, safe environment for children</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span><strong>Seniors</strong> who deserve comfortable, well-maintained homes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span><strong>Pet Owners</strong> needing pet-safe cleaning solutions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span><strong>Eco-Conscious Individuals</strong> refusing to compromise on values</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span><strong>Anyone</strong> who appreciates the luxury of a professionally cleaned home</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-6">📋 Quick Service Overview</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Residential Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>Standard Cleaning (weekly/bi-weekly/monthly)</li>
                    <li>Deep Cleaning (seasonal or as needed)</li>
                    <li>Move-in/Move-out Cleaning</li>
                    <li>Post-construction Cleaning</li>
                    <li>Custom cleaning packages</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Specialty Add-ons</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>Inside oven cleaning</li>
                    <li>Interior window washing</li>
                    <li>Refrigerator deep clean</li>
                    <li>Garage cleaning</li>
                    <li>Organization services</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-serif mb-6">🌟 Client Testimonials Snapshot</h2>
            
            <div className="space-y-4">
              <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                "Finally, a cleaning service that aligns with my values without compromising on quality!"
              </blockquote>
              <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                "The team is professional, thorough, and trustworthy. My home has never looked better."
              </blockquote>
              <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                "Love knowing my kids and pets are safe with their eco-friendly products."
              </blockquote>
            </div>
          </section>

          <section className="bg-muted/30 p-8 rounded-lg">
            <h2 className="text-3xl font-serif mb-4">📞 Ready to Experience the Difference?</h2>
            <p className="text-lg mb-6">
              Transform your space with mindful, eco-luxury cleaning. Book your first service today and discover why our clients trust us with their homes and values.
            </p>
            <a href="/book" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:opacity-90 transition-opacity">
              Book Your Service
            </a>
          </section>
        </div>
      </div>
    </Layout>
  );
}

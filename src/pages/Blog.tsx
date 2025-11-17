import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ritualHeroV2 from "@/assets/ritual-hero-v2.jpg";

const blogArticles = [
  {
    slug: "january-2025",
    title: "The Art of Minimalism: How Less Stuff Means Less Stress",
    excerpt: "New Year, new perspective. As we settle into 2025, many Victorians are embracing minimalism – not as deprivation, but as liberation. Discover why less truly is more.",
    date: "January 2025",
    readTime: "5 min read"
  },
  {
    slug: "february-2025",
    title: "Love Your Home: Creating Spaces That Nurture Relationships",
    excerpt: "February in Victoria brings more than Valentine's Day – it's a time to cultivate love in all its forms. Explore how cleaning and organizing can deepen our capacity for connection.",
    date: "February 2025",
    readTime: "6 min read"
  },
  {
    slug: "march-2025",
    title: "Spring Cleaning the Sustainable Way: A Guide for Eco-Conscious Victorians",
    excerpt: "As cherry blossoms bloom across Victoria, the urge to refresh our homes grows stronger. Your complete guide to sustainable spring cleaning that honors our Island's pristine environment.",
    date: "March 2025",
    readTime: "6 min read"
  },
  {
    slug: "april-2025",
    title: "Earth Month Excellence: Cleaning with Climate Consciousness",
    excerpt: "April brings Earth Day and a global focus on environmental stewardship. Align your cleaning practices with our planet's needs while maintaining a pristine home.",
    date: "April 2025",
    readTime: "7 min read"
  },
  {
    slug: "may-2025",
    title: "May Mindfulness: Creating Wellness Sanctuaries for Modern Families",
    excerpt: "May in Victoria blooms with rhododendrons and Mother's Day celebrations. Discover how a clean, organized home supports physical health, mental clarity, and emotional balance.",
    date: "May 2025",
    readTime: "7 min read"
  },
  {
    slug: "august-2025",
    title: "August Awakening: Transitioning from Summer's Freedom to Fall's Focus",
    excerpt: "As August unfolds in Victoria, morning mists hint at autumn's approach. Embrace mindful home renewal as we transition from summer's relaxed energy to fall's structure.",
    date: "August 2025",
    readTime: "6 min read"
  },
  {
    slug: "september-2025",
    title: "Back-to-School Serenity: Creating Calm in September's Chaos",
    excerpt: "September brings the return of routines, homework stations, and packed lunches. Create a home sanctuary that naturally supports learning and growth.",
    date: "September 2025",
    readTime: "6 min read"
  },
  {
    slug: "october-2025",
    title: "Embracing Autumn's Transition: Your Mindful Fall Cleaning Guide",
    excerpt: "As maple leaves paint Victoria's streets in amber and gold, nature reminds us of the beauty in letting go. Discover autumn cleaning as meditation on transition.",
    date: "October 2025",
    readTime: "5 min read"
  },
  {
    slug: "november-2025",
    title: "The Gratitude Home: Preparing Thankful Spaces for Connection",
    excerpt: "November in Victoria brings crisp mornings and the invitation to gather in gratitude. Learn how cleaning with gratitude transforms routine maintenance into mindful practice.",
    date: "November 2025",
    readTime: "7 min read"
  },
  {
    slug: "december-2025",
    title: "Holiday Harmony: Mindful Cleaning for December's Magic",
    excerpt: "December in Victoria sparkles with boat parades and twinkling lights. Create sacred spaces for memory-making without sacrificing your sanity or environmental values.",
    date: "December 2025",
    readTime: "6 min read"
  }
];

const Blog = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${ritualHeroV2})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.4,
            }}
          />
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <h1 className="font-serif text-5xl md:text-7xl mb-4">
              Mindful Living Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Insights on creating harmonious, healthy spaces
            </p>
          </div>
        </section>

        {/* Blog Articles Grid */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogArticles.map((article) => (
                <Card key={article.slug} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                  <Link to={`/blog/${article.slug}`}>
                    <div className="p-8">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h2 className="font-serif text-2xl mb-4 group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <Button variant="outline" asChild>
                        <span>Read Article</span>
                      </Button>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Blog;

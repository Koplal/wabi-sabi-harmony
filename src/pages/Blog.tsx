import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ritualHeroV2 from "@/assets/ritual-hero-v2.jpg";

const blogArticles = [
  {
    slug: "august",
    title: "The Hidden Health Benefits of a Clean Home: What Science Tells Us",
    excerpt: "As we embrace the colder months in Victoria, we spend more time indoors, making the cleanliness of our living spaces more important than ever. Discover the science-backed health advantages of maintaining a pristine living environment.",
    date: "August 2024",
    readTime: "5 min read"
  },
  {
    slug: "september",
    title: "Spring Cleaning the Sustainable Way: A Guide for Eco-Conscious Victorians",
    excerpt: "As cherry blossoms bloom across Victoria, the urge to refresh our homes grows stronger. Here's your complete guide to sustainable spring cleaning that honors our Island's pristine environment.",
    date: "September 2024",
    readTime: "6 min read"
  },
  {
    slug: "october",
    title: "The Art of Minimalism: How Less Stuff Means Less Stress",
    excerpt: "Many Victorians are embracing minimalism – not as deprivation, but as liberation. At Wabi Sabi Services, we've witnessed firsthand how simplified spaces transform lives. Here's why less truly is more.",
    date: "October 2024",
    readTime: "5 min read"
  },
  {
    slug: "november",
    title: "Living Clean with Furry Friends: A Pet Owner's Guide to Pristine Homes",
    excerpt: "As fellow pet lovers in Victoria, we understand the joy our furry companions bring – and the unique cleaning challenges they present. Here's how to maintain a spotless home while living with pets.",
    date: "November 2024",
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

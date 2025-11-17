import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  publishDate: Date;
  readTime: string;
}

const allBlogArticles: BlogArticle[] = [
  {
    slug: "august-2025",
    title: "August Awakening: Transitioning from Summer's Freedom to Fall's Focus",
    excerpt: "As August unfolds in Victoria, morning mists hint at autumn's approach. Embrace mindful home renewal as we transition from summer's relaxed energy to fall's structure.",
    date: "August 2025",
    publishDate: new Date(2025, 7, 1),
    readTime: "6 min read"
  },
  {
    slug: "september-2025",
    title: "Back-to-School Serenity: Creating Calm in September's Chaos",
    excerpt: "September brings the return of routines, homework stations, and packed lunches. Create a home sanctuary that naturally supports learning and growth.",
    date: "September 2025",
    publishDate: new Date(2025, 8, 1),
    readTime: "6 min read"
  },
  {
    slug: "october-2025",
    title: "Embracing Autumn's Transition: Your Mindful Fall Cleaning Guide",
    excerpt: "As maple leaves paint Victoria's streets in amber and gold, nature reminds us of the beauty in letting go. Discover autumn cleaning as meditation on transition.",
    date: "October 2025",
    publishDate: new Date(2025, 9, 1),
    readTime: "5 min read"
  },
  {
    slug: "november-2025",
    title: "The Gratitude Home: Preparing Thankful Spaces for Connection",
    excerpt: "November in Victoria brings crisp mornings and the invitation to gather in gratitude. Learn how cleaning with gratitude transforms routine maintenance into mindful practice.",
    date: "November 2025",
    publishDate: new Date(2025, 10, 1),
    readTime: "7 min read"
  },
  {
    slug: "december-2025",
    title: "Holiday Harmony: Mindful Cleaning for December's Magic",
    excerpt: "December in Victoria sparkles with boat parades and twinkling lights. Create sacred spaces for memory-making without sacrificing your sanity or environmental values.",
    date: "December 2025",
    publishDate: new Date(2025, 11, 1),
    readTime: "6 min read"
  },
  {
    slug: "january-2026",
    title: "The Art of Minimalism: How Less Stuff Means Less Stress",
    excerpt: "New Year, new perspective. As we settle into 2026, many Victorians are embracing minimalism – not as deprivation, but as liberation. Discover why less truly is more.",
    date: "January 2026",
    publishDate: new Date(2026, 0, 1),
    readTime: "5 min read"
  },
  {
    slug: "february-2026",
    title: "Love Your Home: Creating Spaces That Nurture Relationships",
    excerpt: "February in Victoria brings more than Valentine's Day – it's a time to cultivate love in all its forms. Explore how cleaning and organizing can deepen our capacity for connection.",
    date: "February 2026",
    publishDate: new Date(2026, 1, 1),
    readTime: "6 min read"
  },
  {
    slug: "march-2026",
    title: "Spring Cleaning the Sustainable Way: A Guide for Eco-Conscious Victorians",
    excerpt: "As cherry blossoms bloom across Victoria, the urge to refresh our homes grows stronger. Your complete guide to sustainable spring cleaning that honors our Island's pristine environment.",
    date: "March 2026",
    publishDate: new Date(2026, 2, 1),
    readTime: "6 min read"
  },
  {
    slug: "april-2026",
    title: "Earth Month Excellence: Cleaning with Climate Consciousness",
    excerpt: "April brings Earth Day and a global focus on environmental stewardship. Align your cleaning practices with our planet's needs while maintaining a pristine home.",
    date: "April 2026",
    publishDate: new Date(2026, 3, 1),
    readTime: "7 min read"
  },
  {
    slug: "may-2026",
    title: "May Mindfulness: Creating Wellness Sanctuaries for Modern Families",
    excerpt: "May in Victoria blooms with rhododendrons and Mother's Day celebrations. Discover how a clean, organized home supports physical health, mental clarity, and emotional balance.",
    date: "May 2026",
    publishDate: new Date(2026, 4, 1),
    readTime: "7 min read"
  },
  {
    slug: "june-2026",
    title: "Pet-Friendly Cleaning: Keeping Your Home Fresh and Your Furry Friends Safe",
    excerpt: "Victoria's pet-loving community knows the joy our four-legged friends bring. Maintain a clean, fresh home while ensuring pet safety with our complete guide.",
    date: "June 2026",
    publishDate: new Date(2026, 5, 1),
    readTime: "7 min read"
  },
  {
    slug: "july-2026",
    title: "Summer Sanctuary: Mastering Indoor-Outdoor Living in Victoria",
    excerpt: "July in Victoria is pure magic – long sunny days and outdoor living at its finest. Create seamless indoor-outdoor spaces that celebrate our spectacular West Coast summer.",
    date: "July 2026",
    publishDate: new Date(2026, 6, 1),
    readTime: "8 min read"
  }
];

function generateSitemap(publishedArticles: BlogArticle[]): string {
  const baseUrl = "https://wabisabiservices.ca";
  
  const staticPages = [
    { url: baseUrl, priority: "1.0", changefreq: "weekly" },
    { url: `${baseUrl}/about`, priority: "0.8", changefreq: "monthly" },
    { url: `${baseUrl}/services`, priority: "0.9", changefreq: "monthly" },
    { url: `${baseUrl}/book`, priority: "0.9", changefreq: "monthly" },
    { url: `${baseUrl}/contact`, priority: "0.8", changefreq: "monthly" },
    { url: `${baseUrl}/blog`, priority: "0.9", changefreq: "weekly" },
    { url: `${baseUrl}/ritual`, priority: "0.7", changefreq: "monthly" },
    { url: `${baseUrl}/seasoning`, priority: "0.7", changefreq: "monthly" },
    { url: `${baseUrl}/faq`, priority: "0.6", changefreq: "monthly" },
  ];

  const blogPages = publishedArticles.map(article => ({
    url: `${baseUrl}/blog/${article.slug}`,
    priority: "0.8",
    changefreq: "monthly",
    lastmod: article.publishDate.toISOString().split('T')[0]
  }));

  const allPages = [...staticPages, ...blogPages];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  allPages.forEach(page => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${page.url}</loc>\n`;
    if ('lastmod' in page) {
      sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`;
    }
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  
  return sitemap;
}

function generateStructuredData(article: BlogArticle): object {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "datePublished": article.publishDate.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Wabi Sabi Services",
      "url": "https://wabisabiservices.ca"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Wabi Sabi Services",
      "url": "https://wabisabiservices.ca",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wabisabiservices.ca/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://wabisabiservices.ca/blog/${article.slug}`
    }
  };
}

async function pingSearchEngines(sitemapUrl: string): Promise<void> {
  const pingUrls = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
  ];

  const pingPromises = pingUrls.map(url => 
    fetch(url).catch(err => console.error(`Failed to ping ${url}:`, err))
  );

  await Promise.all(pingPromises);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const today = new Date();
    const publishedArticles = allBlogArticles.filter(article => article.publishDate <= today);
    
    // Generate sitemap in background
    const sitemapGeneration = async () => {
      try {
        const sitemap = generateSitemap(publishedArticles);
        console.log('Generated sitemap with', publishedArticles.length, 'blog articles');
        
        // Note: In production, you'd save this to your hosting/CDN
        // For now, we'll log it and return it in the response
        
        // Ping search engines about the updated sitemap
        await pingSearchEngines('https://wabisabiservices.ca/sitemap.xml');
        console.log('Pinged search engines about sitemap update');
        
        return sitemap;
      } catch (error) {
        console.error('Error generating sitemap:', error);
        throw error;
      }
    };

    // Generate structured data for all published articles
    const structuredDataGeneration = async () => {
      try {
        const structuredDataList = publishedArticles.map(article => ({
          slug: article.slug,
          structuredData: generateStructuredData(article)
        }));
        
        console.log('Generated structured data for', structuredDataList.length, 'articles');
        return structuredDataList;
      } catch (error) {
        console.error('Error generating structured data:', error);
        throw error;
      }
    };

    // Run SEO generation tasks
    const [sitemap, structuredData] = await Promise.all([
      sitemapGeneration(),
      structuredDataGeneration()
    ]);

    // Return response with generated data
    return new Response(
      JSON.stringify({
        success: true,
        message: 'SEO generation started',
        publishedArticles: publishedArticles.length,
        articles: publishedArticles.map(a => ({
          slug: a.slug,
          title: a.title,
          publishDate: a.publishDate.toISOString()
        }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in generate-blog-seo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

# Wabi Sabi Services - Website

Professional cleaning, organizing, and household management services in Victoria, BC.

## Features

- **3 Service Categories**: Cleaning, Organizing, Errands
- **Scheduled Blog Publishing**: Articles automatically appear on their scheduled dates
- **Automated SEO Generation**: Sitemap and structured data updates on article publication
- **Seasonal Services**: Pumpkin decorating, holiday decorations, and more
- **SEO Optimized**: Dynamic sitemap, semantic HTML, meta tags, structured data
- **Mobile Responsive**: Fully responsive design
- **Contact Forms**: Booking with price estimator, contact, and careers forms

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Lovable Cloud (Supabase)
- Supabase Edge Functions (Deno)

## Blog Article Publishing System

Blog articles are scheduled to publish automatically on the first day of their respective months.

### How It Works

1. **Client-Side Filtering**: Articles are filtered based on their `publishDate` in `src/pages/Blog.tsx`
2. **Automatic Visibility**: On the 1st of each month, new articles become visible to users
3. **SEO Generation**: A scheduled edge function generates updated SEO content

### Automated SEO Generation

When new blog articles are published, the `generate-blog-seo` edge function:
- ✅ Generates updated sitemap.xml with new blog post URLs
- ✅ Creates structured data (JSON-LD) for each article
- ✅ Pings Google and Bing about sitemap updates

### Setting Up the Monthly SEO Trigger

**Important**: Set up a scheduled task to call the edge function on the 1st of each month.

#### Option 1: EasyCron (Recommended)
1. Go to [EasyCron](https://www.easycron.com/)
2. Create a new cron job:
   - **URL**: `https://kwtvfjrrrkvdtydarfni.supabase.co/functions/v1/generate-blog-seo`
   - **Schedule**: `0 0 1 * *`
   - **Method**: GET

#### Option 2: Cron-Job.org
1. Go to [Cron-Job.org](https://cron-job.org/)
2. Create cron job with URL above, schedule: 1st of month at 00:00 UTC

#### Manual Trigger
```bash
curl https://kwtvfjrrrkvdtydarfni.supabase.co/functions/v1/generate-blog-seo
```

### Adding New Blog Articles

1. Create article page in `src/pages/blog/[MonthYear].tsx`
2. Add metadata to `src/pages/Blog.tsx` with `publishDate: new Date(YYYY, MM-1, 1)`
3. Add route in `src/App.tsx`
4. Update `supabase/functions/generate-blog-seo/index.ts` with article data

## Edge Functions

- **generate-blog-seo**: Generates SEO content for published articles
- **send-booking-email**: Booking confirmations
- **send-contact-email**: Contact form submissions
- **send-application-email**: Career applications

## Development

```bash
npm install
npm run dev
```

Visit: https://lovable.dev/projects/34b89b2f-7919-42d7-87e2-4e9631bf2ff0

export interface GoogleReview {
  quote: string;
  author: string;
}

const isReview = (value: unknown): value is GoogleReview => {
  const { quote, author } = (value ?? {}) as Partial<Record<keyof GoogleReview, unknown>>;
  return typeof quote === "string" && quote.trim() !== "" && typeof author === "string" && author.trim() !== "";
};

function parseReviews(setting: string | undefined): GoogleReview[] {
  if (!setting) return [];
  try {
    const reviews: unknown = JSON.parse(setting);
    return Array.isArray(reviews) && reviews.every(isReview) ? reviews : [];
  } catch {
    return [];
  }
}

/**
 * Google Business Profile reviews from VITE_GOOGLE_REVIEWS, a JSON array of
 * { "quote", "author" } objects set at deploy time. The text is never written
 * into this repo. The list is empty if the variable is unset or invalid, and
 * the pages then read correctly without it.
 */
export const googleReviews = parseReviews(import.meta.env.VITE_GOOGLE_REVIEWS);

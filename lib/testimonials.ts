import { apiFetch } from "./api";
import type { ITestimonial } from "./types";

/**
 * Fallback revalidation interval (seconds).
 * The primary cache-busting mechanism is the on-demand webhook at
 * /api/revalidate/testimonials — this is just a safety net so that
 * the cache is never stale for more than 5 minutes even if the
 * webhook call fails.
 */
const TESTIMONIALS_REVALIDATE = 0; // 5 minutes (safety net)

interface IApiTestimonialsResponse {
  success: boolean;
  data: { testimonials: ITestimonial[] };
}

function isHealthyTestimonial(item: ITestimonial): boolean {
  return (
    Boolean(item.name?.trim()) &&
    Boolean(item.content?.trim()) &&
    typeof item.rating === "number" &&
    item.rating >= 1
  );
}

export async function getTestimonials(): Promise<ITestimonial[]> {
  try {
    const response = await apiFetch<IApiTestimonialsResponse>(
      "/public/testimonials",
      {
        next: {
          revalidate: TESTIMONIALS_REVALIDATE,
          tags: ["testimonials"],
        },
      }
    );
    return (response.data?.testimonials ?? []).filter(isHealthyTestimonial);
  } catch {
    return [];
  }
}

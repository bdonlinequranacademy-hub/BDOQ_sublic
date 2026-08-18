import { apiFetch } from "./api";
import type { ITestimonial } from "./types";

const TESTIMONIALS_REVALIDATE = 3600;

interface IApiTestimonialsResponse {
  success: boolean;
  data: { testimonials: ITestimonial[] };
}

function isHealthyTestimonial(item: ITestimonial): boolean {
  return (
    Boolean(item.name?.trim()) &&
    Boolean(item.content?.trim()) &&
    item.content.trim().length >= 40 &&
    typeof item.rating === "number" &&
    item.rating >= 1
  );
}

export async function getTestimonials(): Promise<ITestimonial[]> {
  try {
    const response = await apiFetch<IApiTestimonialsResponse>(
      "/public/testimonials",
      { next: { revalidate: TESTIMONIALS_REVALIDATE } }
    );
    return (response.data?.testimonials ?? []).filter(isHealthyTestimonial);
  } catch {
    return [];
  }
}

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand revalidation endpoint for testimonials cache.
 * Called by the backend (My-Academy) whenever a testimonial is
 * created, updated, or deleted in the admin panel.
 *
 * POST /api/revalidate/testimonials
 * Header: x-revalidate-secret: <REVALIDATE_SECRET>
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    revalidateTag("testimonials");
    return NextResponse.json(
      { success: true, message: "Testimonials cache revalidated" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Revalidation failed" },
      { status: 500 }
    );
  }
}

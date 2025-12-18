import { revalidateTag, revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const requestHeaders = new Headers(request.headers);
	const secret = requestHeaders.get("x-vercel-reval-key");

	if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
		return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
	}

	try {
		// Revalidate the posts cache tag
		revalidateTag("posts");

		// Also revalidate specific paths that use this data
		revalidatePath("/");
		revalidatePath("/posts/[slug]", "page");

		console.log(`Cache revalidated at ${new Date().toISOString()}`);

		return NextResponse.json({
			revalidated: true,
			now: Date.now(),
			tags: ["posts"],
			paths: ["/", "/posts/[slug]"]
		});
	} catch (error) {
		console.error("Revalidation error:", error);
		return NextResponse.json(
			{ message: "Revalidation failed", error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}

// GET endpoint for cache status (optional, for monitoring)
export async function GET() {
	return NextResponse.json({
		message: "Cache revalidation endpoint",
		method: "POST",
		headers: {
			"x-vercel-reval-key": "YOUR_CONTENTFUL_REVALIDATE_SECRET"
		}
	});
}

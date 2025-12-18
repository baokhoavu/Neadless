import type { Document } from "@contentful/rich-text-types";

const POST_GRAPHQL_FIELDS = `
  slug
  title
  coverImage {
    url
  }
  date
  author
  excerpt
  content {
    json
  }
`;

interface CoverImage {
	url: string;
}

export interface Content {
	json: Document; // Contentful rich text document
	links: {
		assets: {
			block: Array<{
				sys: { id: string };
				url: string;
				description: string;
			}>;
		};
	};
}

interface Post {
	slug: string;
	title: string;
	coverImage: CoverImage | null;
	date: string;
	author: string | null;
	excerpt: string;
	content: Content;
}

interface GraphQLResponse<T> {
	data: {
		lessonCollection: {
			items: T[];
		};
	};
}

// Next.js fetch options with cache tags
interface NextFetchOptions {
	tags?: string[];
	revalidate?: number | false;
}

// Extended RequestInit for Next.js fetch API
interface NextRequestInit extends RequestInit {
	next?: NextFetchOptions;
}

// Request memoization cache for the same request lifecycle
const requestCache = new Map<string, Promise<unknown>>();

// Rate limiting: simple delay between requests
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // 100ms between requests

async function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchGraphQL(query: string, preview = false): Promise<unknown> {
	const cacheKey = `${query}:${preview}`;

	// Track total requests
	cacheStats.requests++;

	// Return cached promise if same request is in flight
	if (requestCache.has(cacheKey)) {
		cacheStats.cacheHits++;
		// Safe to get since we just checked has() - TypeScript doesn't know Map.get() guarantees
		const cached = requestCache.get(cacheKey);
		if (cached) return cached;
	}

	// Rate limiting: ensure minimum interval between requests
	const now = Date.now();
	const timeSinceLastRequest = now - lastRequestTime;
	if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
		await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
	}
	lastRequestTime = Date.now();

	const promise = fetch(
		`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${
					preview
						? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
						: process.env.CONTENTFUL_ACCESS_TOKEN
				}`,
			},
			body: JSON.stringify({ query }),
			next: {
				tags: ["posts"],
				revalidate: preview ? 0 : 3600, // 1 hour for production, no cache for preview
			},
		} as NextRequestInit)
		.then(async (response) => {
			if (!response.ok) {
				// Handle rate limiting
				if (response.status === 429) {
					cacheStats.rateLimitHits++;
					cacheStats.lastRateLimit = new Date();
					console.warn("Contentful rate limit hit, retrying after delay...");
					await delay(2000); // Wait 2 seconds before retry
					return fetchGraphQL(query, preview); // Retry once
				}
				throw new Error(`Contentful API error: ${response.status}`);
			}
			return response.json();
		})
		.finally(() => {
			// Clean up cache after request completes
			setTimeout(() => requestCache.delete(cacheKey), 100);
		});

	// Cache the promise
	requestCache.set(cacheKey, promise);

	return promise;
}

function extractPost(fetchResponse: GraphQLResponse<Post>): Post | null {
	return fetchResponse?.data?.lessonCollection?.items?.[0] || null;
}

function extractPostEntries(fetchResponse: GraphQLResponse<Post>): Post[] {
	return fetchResponse?.data?.lessonCollection?.items || [];
}

export async function getPreviewPostBySlug(
	slug: string | null,
): Promise<Post | null> {
	const entry = await fetchGraphQL(
		`query {
      lessonCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
		true,
	);
	return extractPost(entry as GraphQLResponse<Post>);
}

export async function getAllPosts(isDraftMode: boolean): Promise<Post[]> {
	const entries = await fetchGraphQL(
		`query {
      lessonCollection(preview: ${isDraftMode ? "true" : "false"}, limit: 10) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
		isDraftMode,
	);
	return extractPostEntries(entries as GraphQLResponse<Post>);
}

export async function getPostAndMorePosts(
	slug: string,
	preview: boolean,
): Promise<{ post: Post | null; morePosts: Post[] }> {
	// Use Promise.allSettled to make requests in parallel but handle failures gracefully
	const [entryResult, entriesResult] = await Promise.allSettled([
		fetchGraphQL(
			`query {
        lessonCollection(where: { slug: "${slug}" }, preview: ${
					preview ? "true" : "false"
				}, limit: 1) {
          items {
            ${POST_GRAPHQL_FIELDS}
          }
        }
      }`,
			preview,
		),
		fetchGraphQL(
			`query {
        lessonCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${
					preview ? "true" : "false"
				}, limit: 2) {
          items {
            ${POST_GRAPHQL_FIELDS}
          }
        }
      }`,
			preview,
		),
	]);

	// Handle potential failures gracefully
	const entry = entryResult.status === "fulfilled" ? entryResult.value : null;
	const entries =
		entriesResult.status === "fulfilled" ? entriesResult.value : null;

	const post = entry ? extractPost(entry as GraphQLResponse<Post>) : null;
	const morePosts = entries
		? extractPostEntries(entries as GraphQLResponse<Post>)
		: [];

	return {
		post,
		morePosts,
	};
}

// Cache monitoring utilities
export const cacheStats = {
	requests: 0,
	cacheHits: 0,
	rateLimitHits: 0,
	lastRateLimit: null as Date | null,
};

// Export cache stats for monitoring
export function getCacheStats() {
	return {
		...cacheStats,
		cacheHitRate:
			cacheStats.requests > 0
				? (cacheStats.cacheHits / cacheStats.requests) * 100
				: 0,
		timeSinceLastRateLimit: cacheStats.lastRateLimit
			? Date.now() - cacheStats.lastRateLimit.getTime()
			: null,
	};
}

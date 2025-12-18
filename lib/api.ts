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

interface Content {
	json: unknown; // Contentful rich text JSON
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

async function fetchGraphQL(query: string, preview = false): Promise<unknown> {
	return fetch(
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
			next: { tags: ["posts"] },
		},
	).then((response) => response.json());
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
	return extractPost(entry);
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
	return extractPostEntries(entries);
}

export async function getPostAndMorePosts(
	slug: string,
	preview: boolean,
): Promise<{ post: Post | null; morePosts: Post[] }> {
	const entry = await fetchGraphQL(
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
	);
	const entries = await fetchGraphQL(
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
	);
	return {
		post: extractPost(entry),
		morePosts: extractPostEntries(entries),
	};
}

import Link from "next/link";
import ContentfulImage from "../lib/contentful-image";

function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]) {
	return inputs
		.flatMap(input => {
			if (typeof input === 'string') return input;
			if (typeof input === 'object' && input !== null) {
				return Object.entries(input)
					.filter(([, value]) => value)
					.map(([key]) => key);
			}
			return [];
		})
		.filter(Boolean)
		.join(" ");
}

export default function CoverImage({
	title,
	url,
	slug,
}: {
	title: string;
	url: string;
	slug?: string;
}) {
	const image = (
		<ContentfulImage
			alt={`Cover Image for ${title}`}
			priority
			width={2000}
			height={1000}
			className={cn("shadow-small", {
				"hover:shadow-medium transition-shadow duration-200": !!slug,
			})}
			src={url}
		/>
	);

	return (
		<div className="sm:mx-0">
			{slug ? (
				<Link href={`/posts/${slug}`} aria-label={title}>
					{image}
				</Link>
			) : (
				image
			)}
		</div>
	);
}

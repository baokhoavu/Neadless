import { draftMode } from "next/headers";
import Link from "next/link";
import { getAllPosts } from "@/lib/api";
import { CMS_NAME, CMS_URL } from "@/lib/constants";
import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";
import MoreStories from "./more-stories";

interface CoverImageData {
	url: string;
}

function Intro() {
	return (
		<section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
			<h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
			</h1>
			<h2 className="text-center md:text-left text-lg mt-5 md:pl-8">
				<strong>Neadless.</strong> A headless CMS full stack Web Application using{" "}
				<a
					href="https://nextjs.org/"
					className="underline hover:text-success duration-200 transition-colors"
				>
					Next.js
				</a>{" "}
				and{" "}
				<a
					href={CMS_URL}
					className="underline hover:text-success duration-200 transition-colors"
				>
					{CMS_NAME}
				</a>
				.
			</h2>
		</section>
	);
}

function HeroPost({
	title,
	coverImage,
	date,
	excerpt,
	author,
	slug,
}: {
	title: string;
	coverImage: CoverImageData | null;
	date: string;
	excerpt: string;
	author: string | null;
	slug: string;
}) {
	return (
		<section>
			<div className="mb-8 md:mb-16">
				{coverImage && (
					<CoverImage title={title} slug={slug} url={coverImage.url} />
				)}
			</div>
			<div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
				<div>
					<h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
						<Link href={`/posts/${slug}`} className="hover:underline">
							{title}
						</Link>
					</h3>
					<div className="mb-4 md:mb-0 text-lg">
						<DateComponent dateString={date} />
					</div>
				</div>
				<div>
					<p className="text-lg leading-relaxed mb-4">{excerpt}</p>
					{author && <Avatar name={author} picture={null} />}
				</div>
			</div>
		</section>
	);
}

export default async function Page() {
	const { isEnabled } = await draftMode();
	const allPosts = await getAllPosts(isEnabled);
	const heroPost = allPosts?.[0];
	const morePosts = allPosts?.slice(1) || [];

	return (
		<div className="container mx-auto px-5">
			<Intro />
			{heroPost && (
				<HeroPost
					title={heroPost.title}
					coverImage={heroPost.coverImage}
					date={heroPost.date}
					author={heroPost.author}
					slug={heroPost.slug}
					excerpt={heroPost.excerpt}
				/>
			)}
			<MoreStories morePosts={morePosts} />
		</div>
	);
}

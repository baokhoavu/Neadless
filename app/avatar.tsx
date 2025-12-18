import ContentfulImage from "@/lib/contentful-image";

interface CoverImage {
	url: string;
}

export default function Avatar({
	name,
	picture,
}: {
	name: string;
	picture: CoverImage | null;
}) {
	return (
		<div className="flex items-center">
			{picture ? (
				<div className="mr-4 w-12 h-12">
					<ContentfulImage
						alt={name}
						className="object-cover h-full rounded-full"
						height={48}
						width={48}
						src={picture.url}
					/>
				</div>
			) : null}
			<div className="text-xl font-bold">{name}</div>
		</div>
	);
}

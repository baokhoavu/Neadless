"use client";

import Image from "next/image";

interface ContentfulImageProps
	extends Omit<React.ComponentProps<typeof Image>, "loader"> {
	src: string;
	width?: number;
	quality?: number;
}

const contentfulLoader = ({ src, width }: { src: string; width: number }) => {
	return `${src}?w=${width}&q=75`;
};

export default function ContentfulImage(props: ContentfulImageProps) {
	const { alt, ...rest } = props;
	return <Image alt={alt} loader={contentfulLoader} {...rest} />;
}

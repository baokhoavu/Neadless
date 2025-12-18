import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import Image from "next/image";
import type { Content } from "./api";

interface Asset {
	sys: {
		id: string;
	};
	url: string;
	description: string;
}

function RichTextAsset({
	id,
	assets,
}: {
	id: string;
	assets: Asset[] | undefined;
}) {
	const asset = assets?.find((asset) => asset.sys.id === id);

	if (asset?.url) {
		return <Image src={asset.url} layout="fill" alt={asset.description} />;
	}

	return null;
}

export function Markdown({ content }: { content: Content }) {
	return documentToReactComponents(content.json, {
		renderNode: {
			[BLOCKS.EMBEDDED_ASSET]: (node: unknown) => (
				<RichTextAsset
					id={
						(node as { data: { target: { sys: { id: string } } } }).data.target
							.sys.id
					}
					assets={content.links.assets.block}
				/>
			),
		},
	});
}

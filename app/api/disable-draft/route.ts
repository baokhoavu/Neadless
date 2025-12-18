import { draftMode } from "next/headers";

export async function GET(_request: Request) {
	draftMode().disable();
	return new Response("Draft mode is disabled");
}

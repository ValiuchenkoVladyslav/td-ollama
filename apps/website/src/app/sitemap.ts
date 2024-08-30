import type { MetadataRoute } from "next";
import { APP_URL } from "~/meta";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: APP_URL,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
	];
}

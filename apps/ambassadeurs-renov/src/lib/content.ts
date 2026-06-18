const modules = import.meta.glob("/content/**/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

export const allContent = Object.entries(modules).map(([path, raw]) => {
	const normalized = raw.replace(/\r\n/g, "\n");
	const slug = path.replace("/content/", "").replace(".md", "");
	return { slug, content: normalized };
});

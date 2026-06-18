import _ressources from "../data/ressources.json";

export type Ressource = {
	titre: string;
	description: string;
	url: string;
	img: string;
	tags: string[];
};

export const ressources: Ressource[] = _ressources;

export const tags: string[] = Array.from(
	new Set(_ressources.flatMap((r) => r.tags)),
);

export function filterRessourcesByTags(
	ressources: Ressource[],
	tags: string[],
): Ressource[] {
	return ressources.filter((ressource) => {
		return tags.every((tag) => ressource.tags.includes(tag));
	});
}

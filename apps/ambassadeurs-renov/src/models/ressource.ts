import _ressources from "../../data/ressources.json";

export type Ressource = {
	titre: string;
	description: string;
	url: string;
	img: string;
	tags: Tag[];
};

export type Tag = string;

export const ressources: Ressource[] = _ressources;

export const tags: Tag[] = Array.from(
	new Set(_ressources.flatMap((r) => r.tags)),
);

export function filterRessourcesByTags(tags: Tag[]): Ressource[] {
	return ressources.filter((ressource) => {
		return tags.every((tag) => ressource.tags.includes(tag));
	});
}

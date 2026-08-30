import _ressources from "../../data/ressources.json";

export type Ressource = {
	titre: string;
	description: string;
	url: string;
	img: string;
	tags: Tag[];
};

export type Tag = string;

export interface RessourcesRepository {
	all(): Ressource[];
	byTags(tags: Tag[]): Ressource[];
}

export interface TagsRepository {
	all(): Tag[];
}

export const ressource: RessourcesRepository = {
	all(): Ressource[] {
		return _ressources;
	},

	byTags(tags: Tag[]): Ressource[] {
		return _ressources.filter((ressource) => {
			return tags.every((tag) => ressource.tags.includes(tag));
		});
	},
};

export const tag: TagsRepository = {
	all(): Tag[] {
		return Array.from(new Set(_ressources.flatMap((r) => r.tags)));
	},
};

export function filterRessourcesByTags(
	ressources: Ressource[],
	tags: string[],
): Ressource[] {
	return ressources.filter((ressource) => {
		return tags.every((tag) => ressource.tags.includes(tag));
	});
}

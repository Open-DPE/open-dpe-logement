export class ValeurForfaitaireError extends Error {
	constructor(props: object) {
		super(`Aucune valeur forfaitaire trouvée pour : ${JSON.stringify(props)}`);
		this.name = "ValeurForfaitaireError";
	}
}

export class PositiveError extends Error {
	constructor(value: number | null) {
		super(`La valeur attendue doit être un nombre supérieur à zéro : ${value}`);
		this.name = "PositiveError";
	}
}
export class NonNegativeError extends Error {
	constructor(value: number | null) {
		super(
			`La valeur attendue doit être un nombre supérieur ou égal à zéro : ${value}`,
		);
		this.name = "NonNegativeError";
	}
}

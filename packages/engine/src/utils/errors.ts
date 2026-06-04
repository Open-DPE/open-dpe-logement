export class ValeurForfaitaireError extends Error {
	constructor(props: object) {
		super(`Aucune valeur forfaitaire trouvée pour : ${JSON.stringify(props)}`);
		this.name = "ValeurForfaitaireError";
	}
}

export class UnprocessableValeurError extends Error {
	constructor(props: object) {
		super(`Valeur non traitable pour : ${JSON.stringify(props)}`);
		this.name = "UnprocessableValeurError";
	}
}

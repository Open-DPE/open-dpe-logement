export class ValeurForfaitaireError extends Error {
	constructor(props: object) {
		super(`Aucune valeur forfaitaire trouvée pour : ${JSON.stringify(props)}`);
		this.name = "ValeurForfaitaireError";
	}
}

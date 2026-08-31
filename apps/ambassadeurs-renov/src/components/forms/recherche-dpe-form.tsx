import { useState, type FormEvent, type MouseEvent } from "react";
import { toast } from "sonner";
import { SearchIcon } from "lucide-react";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { importDiagnostic } from "@/handlers/import-diagnostic";
import { type Adresse } from "@/services/search-adresse";
import { searchDPE, type DPE } from "@/services/search-dpe";
import { AdresseAutocomplete } from "./adresse-autocomplete";

interface Props {
	onSuccess: () => void;
}

function formatDate(value: string): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString("fr-FR");
}

export function RechercheDpeForm({ onSuccess }: Props) {
	const [adresse, setAdresse] = useState<Adresse | null>(null);

	const [searchPending, setSearchPending] = useState(false);
	const [searchError, setSearchError] = useState<string>();
	const [results, setResults] = useState<Array<DPE>>();

	const [selectedNumero, setSelectedNumero] = useState<string>();
	const [selectionError, setSelectionError] = useState<string>();

	const [error, setError] = useState<string>();
	const [pending, setPending] = useState(false);

	function handleAdresseChange(value: Adresse | null) {
		setAdresse(value);
		setResults(undefined);
		setSelectedNumero(undefined);
		setSelectionError(undefined);
		setError(undefined);
	}

	async function handleSearch(e: MouseEvent) {
		e.preventDefault();

		if (!adresse) {
			setSearchError("Sélectionnez une adresse dans la liste de suggestions.");
			return;
		}

		setSearchPending(true);
		setSearchError(undefined);
		setSelectedNumero(undefined);
		setSelectionError(undefined);
		setError(undefined);

		try {
			const { results } = await searchDPE(adresse.properties.label);
			setResults(results);
		} catch (error) {
			setResults(undefined);
			toast.error(error instanceof Error ? error.message : "Erreur inconnue");
		} finally {
			setSearchPending(false);
		}
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!selectedNumero) {
			setSelectionError("Sélectionnez un DPE dans la liste.");
			return;
		}

		setPending(true);

		const { success, message } = await importDiagnostic({
			numero: selectedNumero,
		});

		if (success) {
			toast.success(message);
			onSuccess();
		} else {
			toast.error(message);
		}
		setPending(false);
	}

	return (
		<div className="flex flex-col gap-4">
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<Field>
					<ButtonGroup>
						<AdresseAutocomplete
							className="flex-1 bg-white"
							onChange={handleAdresseChange}
						/>
						<Button
							type="button"
							onClick={handleSearch}
							disabled={searchPending || !adresse}
						>
							{searchPending ? (
								<>
									<Spinner data-icon="inline-start" /> Recherche...
								</>
							) : (
								<>
									<SearchIcon /> Rechercher
								</>
							)}
						</Button>
					</ButtonGroup>
					{searchError && (
						<FieldError className="mt-1">{searchError}</FieldError>
					)}
				</Field>

				{results && results.length === 0 && (
					<p className="text-sm text-muted-foreground">
						Aucun DPE trouvé pour cette adresse.
					</p>
				)}

				{results && results.length > 0 && (
					<Field>
						<RadioGroup
							name="numero_dpe"
							required
							value={selectedNumero}
							onValueChange={(value: string) => {
								setSelectedNumero(value);
								setSelectionError(undefined);
							}}
						>
							{results.map((dpe) => (
								<FieldLabel
									key={dpe.numero_dpe}
									htmlFor={dpe.numero_dpe}
									className="bg-white"
								>
									<Field orientation="horizontal">
										<FieldContent>
											<FieldTitle>
												{dpe.adresse_ban ?? dpe.adresse_complete_brut}
											</FieldTitle>
											<FieldDescription>
												Type de bâtiment : {dpe.type_batiment} <br />
												Date d'établissement :{" "}
												{formatDate(dpe.date_etablissement_dpe)}
											</FieldDescription>
										</FieldContent>
										<RadioGroupItem
											value={dpe.numero_dpe}
											id={dpe.numero_dpe}
										/>
									</Field>
								</FieldLabel>
							))}
						</RadioGroup>
						{selectionError && (
							<FieldError className="mt-1">{selectionError}</FieldError>
						)}
					</Field>
				)}

				{error && <FieldError>{error}</FieldError>}

				{results && results.length > 0 && (
					<Button
						type="submit"
						className="w-full"
						disabled={pending || !selectedNumero}
					>
						{pending ? (
							<>
								<Spinner data-icon="inline-start" /> En cours...
							</>
						) : (
							"Valider"
						)}
					</Button>
				)}
			</form>
		</div>
	);
}

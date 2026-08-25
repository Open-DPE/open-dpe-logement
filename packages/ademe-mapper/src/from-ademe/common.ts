import { v4 as uuidv4 } from "uuid";
import type { Input } from "./types.js";

export function createId(): string {
	return uuidv4();
}

export function round(value: number): number;
export function round(value: null | undefined): null;
export function round(value: number | null | undefined): number | null;
export function round(value: number | null | undefined): number | null {
	if (value === null || value === undefined) return null;
	if (value === 0) return 0;
	return Math.round(value * 100) / 100;
}

export function mapBoolean(value: 0 | 1): boolean;
export function mapBoolean(value: null | undefined): null;
export function mapBoolean(value: 0 | 1 | null | undefined): boolean | null;
export function mapBoolean(value: 0 | 1 | null | undefined): boolean | null {
	if (value === null || value === undefined) return null;
	return value === 1;
}

export function mapAnneeEtablissement(props: Input): number {
	return new Date(props.administratif.date_etablissement_dpe).getFullYear();
}

/**
 * @deprecated
 */
export function matchReferences(ref1: string, ref2: string): boolean {
	if (ref1 === ref2) return true;
	if (ref1.match(ref2)) return true;
	if (ref2.match(ref1)) return true;
	return false;
}

export function mapReferences(ref1: string, ref2: string): string | null {
	if (ref1 === ref2) return ref1;
	if (ref1.match(ref2)) return ref1;
	if (ref2.match(ref1)) return ref2;
	return null;
}

import { describe, expect, it } from "vitest";
import type { refroidissement } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, UUID2 } from "../helpers.js";

describe("isInstallation refroidissement — guard", () => {
	it("accepte une installation de refroidissement valide", () => {
		const installation: refroidissement.installation.Installation = {
			id: UUID,
			description: "Installation refroidissement réversible",
			surface: 80,
			generateurs: [UUID2],
		};
		expect(validator.refroidissement.isInstallation(installation)).toBe(true);
	});
});

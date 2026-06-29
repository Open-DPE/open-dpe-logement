import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export async function loadAsset(key: string): Promise<unknown> {
	const path = join(PACKAGE_ROOT, "data", `${key}.json`);
	const content = await readFile(path, "utf-8");
	return JSON.parse(content);
}

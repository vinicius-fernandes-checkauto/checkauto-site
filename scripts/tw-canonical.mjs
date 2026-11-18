import { glob, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { __unstable__loadDesignSystem } from "@tailwindcss/node";

const fix = process.argv.includes("--fix");
const cssPath = path.resolve("app/app.css");
const ds = await __unstable__loadDesignSystem(await readFile(cssPath, "utf8"), {
	base: path.dirname(cssPath),
});

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let total = 0;

for await (const file of glob("app/**/*.{ts,tsx}")) {
	const source = await readFile(file, "utf8");
	let output = source;

	const strings = source.match(/"[^"\n]*"|`[^`]*`/g) ?? [];
	const tokens = new Set(
		strings.flatMap(
			(value) => value.slice(1, -1).match(/[^\s"'`{}(),$]+/g) ?? [],
		),
	);

	for (const token of tokens) {
		if (!ds.parseCandidate(token).length) continue;

		const [canonical] = ds.canonicalizeCandidates([token], { rem: 16 });
		if (!canonical || canonical === token) continue;

		total++;
		console.log(`${file}: ${token} → ${canonical}`);
		output = output.replace(
			new RegExp(`(?<=[\\s"'\`])${escapeRegExp(token)}(?=[\\s"'\`])`, "g"),
			canonical,
		);
	}

	if (fix && output !== source) await writeFile(file, output);
}

console.log(
	total
		? `${total} classe(s) fora do padrão canônico${fix ? " corrigida(s)" : ""}.`
		: "Todas as classes estão no padrão canônico.",
);
if (total && !fix) process.exitCode = 1;

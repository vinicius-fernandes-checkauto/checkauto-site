export type LegalListItem = {
	marker: string;
	term?: string;
	text: string;
};

export type LegalBlock =
	| { kind: "paragraph"; number?: string; text: string }
	| { kind: "list"; items: LegalListItem[] }
	| { kind: "subheading"; text: string };

export type LegalSectionContent = {
	id: string;
	number: string;
	title: string;
	blocks: LegalBlock[];
};

export type LegalDocumentContent = {
	title: string;
	updatedAt: string;
	intro: { text: string; emphasis: boolean }[];
	sections: LegalSectionContent[];
};

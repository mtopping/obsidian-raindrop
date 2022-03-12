import type { Link } from "./types";

const externalURIRegex =
	/((http|https):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/;
const markdownLinkRegex =
	/\[(.*)\]\((((http|https):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-]))?\)/;

const removeEscapeCharacters = (text: string) => {
	return text.replace("\\", "");
};

const isWikiLink = (text: string) => {
	console.info("isWikiLink: ", text);
};

const parseMarkupLink = (text: string): Link | null => {
	// console.info("parseMarkupLink: ", text);
	const linkMatch = text.match(markdownLinkRegex);

	return linkMatch === null
		? null
		: {
				text: removeEscapeCharacters(linkMatch[1]),
				url: linkMatch[2],
		  };
};

const getLink = (text: string): Link | null => {
	// console.info("getExternalURL: ", text);

	// if it is a markdown link then pull from the url section of the markdown
	const markdownLink: Link = parseMarkupLink(text);

	if (markdownLink !== null) return markdownLink;

	const linkMatch = text.match(externalURIRegex);

	return linkMatch === null
		? null
		: {
				url: linkMatch[0],
		  };
};

export { isWikiLink, getLink };

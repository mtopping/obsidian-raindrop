import { Link, RaindropCollection } from "./types";

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

const renderTreeToDOM = (data: any[], rootElement: HTMLElement) => {
	let treeDOM = rootElement.createEl("ul");

	return data.reduce((dom: HTMLUListElement, item, index) => {
		// console.log(dom);
		// console.log(item);

    const li = dom.createEl("li");

		// if it's a leaf
		if (item.data.count === 0) {
			const titleSpan = li.createSpan({ text: item.data.title });

			li.appendChild(titleSpan);
			li.setAttribute("id", item.data.id);
			dom.appendChild(li);
		}

		// if it's a branch
		if (item.data.count > 0) {
      li.classList.add('has-children');
			const titleSpan = li.createSpan({ text: item.data.title });
			li.appendChild(titleSpan);
			li.appendChild(renderTreeToDOM(item.children, dom));
      li.onclick = (evt) => {
        evt.stopPropagation();
        const clickedCollection = evt.currentTarget as HTMLLIElement;
        clickedCollection.classList.toggle('open')
        console.log('click parent', evt.currentTarget);
        // ()
      }
		}
		return dom;
	}, treeDOM);
};


const waitingIndicatorHTML = () => {
	const dotCount = 6;
	let _document = document.implementation.createHTMLDocument();
	let container = _document.body.createDiv();
	container.classList.add("indicator");

	for (let i = 0; i <= dotCount; i++) {
		container.createDiv();
	}

	return container;
};

export { isWikiLink, getLink, renderTreeToDOM, waitingIndicatorHTML };

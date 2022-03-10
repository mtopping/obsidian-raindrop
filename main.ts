import type { BlockQueryMap, BlockQueryMapKeys, Link, RaindropCollection } from "src/types";
import Collections from "src/components/Collections.svelte";

import {
	App,
	Component,
	Editor,
	MarkdownView,
	Menu,
	MenuItem,
	Modal,
	Plugin,
	PluginSettingTab,
	Setting,
	type MarkdownPostProcessorContext,
} from "obsidian";

import {
	getCollections,
	getRaindrops,
} from "src/raindrop";

import {
	getLink,
	renderTreeToDOM,
} from "src/utils";

interface ObsidianRaindropSettings {
	raindropAccessToken: string;
}

const DEFAULT_SETTINGS: ObsidianRaindropSettings = {
	raindropAccessToken: "",
};

export default class ObsidianRaindrop extends Plugin {
	settings: ObsidianRaindropSettings;

	async onload() {
		// console.info("onload");
		await this.loadSettings();
		this.registerEvents();
		this.registerPostProcessors();

		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('Hello!');
		// });
		// Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new NewRaindropModal(this.app).open();
		// 	}
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new NewRaindropModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ObsidianRaindropSettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log("onunload");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * registerPostProcessors
	 * 
	 * We use a code block preprocessor to parse the content for running queries to Raindrop
	 * whenever the code block language is set to 'raindrop'
	 */
	private registerPostProcessors() {
		// Raindrop code blocks.
		let registered = this.registerMarkdownCodeBlockProcessor(
			"raindrop",
			async (source: string, el, ctx) => {
				this.viewFromCodeBlock(source, el, ctx, ctx.sourcePath);
			}
		);
		registered.sortOrder = -100;
	}

	/**
	 * registerEvents
	 * 
	 * Bind callbacks to editor events
	 * 
	 * editor-menu: context menu to create a new Raindrop bookmark
	 */
	private registerEvents() {
		// console.log("registerEvents");

		// context menu
		this.app.workspace.on("editor-menu", (menu: Menu, editor: Editor, view: MarkdownView) => {
			// console.info("context menu");
			menu.addItem((item: MenuItem) => {
				item.setTitle("Create Raindrop Bookmark").onClick((evt) => {
					this.handleCreateBookmark(editor);
				});
			});
		});

		// this.registerEvent(
		//   this.app.internalPlugins.on(
		//     "change",
		//     this.handleInternalPluginsChange,
		//     this
		//   )
		// );
		// this.registerEvent(
		//   this.app.workspace.on("file-menu", this.handleFileMenu, this)
		// );
		// this.registerEvent(
		//   this.app.workspace.on("layout-change", this.handleLayoutChange, this)
		// );
	}

	/**
	 * handleCreateBookmark
	 * 
	 * WIP: Create a bookmark in raindrop from the selected link
	 * @param editor 
	 */
	private handleCreateBookmark(editor: Editor) {
		// console.info("handleCreateBookmark");
		const currentSelection = editor.getSelection();
		const cursorFrom = editor.getCursor("from");
		const cursorTo = editor.getCursor("to");
		const cursorHead = editor.getCursor("head");
		const cursorAnchor = editor.getCursor("anchor");
		const wordAt = editor.wordAt(cursorFrom);

		const fullLine = editor.getLine(cursorFrom.line);

		// console.log("clicked new bookmark: ", {
		// 	currentSelection,
		// 	wordAt,
		// 	cursorFrom,
		// 	cursorTo,
		// 	cursorHead,
		// 	cursorAnchor,
		// 	fullLine,
		// });

		// get the link
		const link: Link = getLink(fullLine);
		console.log(link);
		// TODO show UI for extra fields (collection: select, tags: autocomplete, url, title)
		new NewRaindropModal(
			this.app,
			this.settings.raindropAccessToken
		).open();
		// with tag autocomplete, etc?
		// createRaindrop(link, this.settings.raindropAccessToken);
		// get the title
		// const
	}

	/**
	 * Generate HTML elements and append them to the provided element based on 
	 * the results of a query to Raindrop using the provided parameters in a
	 * codeblock with the 'raindrop' language defined.
	 * 
	 * https://developer.raindrop.io/v1/raindrops/multiple#common-parameters
	 * https://help.raindrop.io/using-search/#operators
	 * 
	 * Collections special IDs:
	 * 
	 * 	0 to get all (except Trash)
	 * 	-1 to get from "Unsorted"
	 * 	-99 to get from "Trash"
	 * 
	 * @param {string} source Text content of the codeblock
	 * @param {HTMLElement} el HTML element to which this code block is attached
	 * @param {Component} component Obsidian component
	 * @param {string} sourcePath 
	 */
	public async viewFromCodeBlock(
		source: string,
		el: HTMLElement,
		component: Component | MarkdownPostProcessorContext,
		sourcePath: string
	) {
		// console.info('viewFromCodeBlock');

		const paramMap: BlockQueryMap = {
			search: '',
			format: '',
			sort: '',
			collection: 0
		}

		Object.keys(paramMap).forEach((key: BlockQueryMapKeys) => {
			const re = new RegExp(`${key}:(.*)`);
			const matchArr = source.match(re);
			let result: string | number  = (matchArr && matchArr.length > 1) ? matchArr[1].trim() : null;

			if(key === 'collection') {
				paramMap['collection'] = parseInt(result) || 0;
			} else {
					paramMap[key] = result;
			}
		});
		
		try {
			const raindrops = await getRaindrops(paramMap['collection'], paramMap['search'], paramMap['sort'], this.settings.raindropAccessToken);
			
			const container = (paramMap['format']) ? el.createEl('ul') : el.createEl('table');
			
			raindrops.items.forEach((raindrop: any) => {
				let parent: HTMLElement;
				
				if(paramMap['format']) {
					parent = container.createEl('li');
				} else {
					const row = container.createEl('tr');
					parent = row.createEl('td');
				}
				
				const a = parent.createEl('a', {href: raindrop.link, text: raindrop.title})

			});
		} catch (err) {
			console.error(err);
		}
	}
}

/**
 * Modal is used for creating a new raindrop bookmark
 * 
 * Work in progress
 */
class NewRaindropModal extends Modal {
	raindropAccessToken: string;
	// raindropCollections: Record<string,RaindropCollection>;
	raindropCollections: any;
	selectedRaindropRootCollection: RaindropCollection;
	selectedRaindropChildCollection: RaindropCollection;
	collectionsSelect: Collections;

	constructor(app: App, raindropAccessToken: string) {
		super(app);

		this.raindropAccessToken = raindropAccessToken;
		// this.modalEl.empty();

		// this.modalEl.appendChild(waitingIndicatorHTML());

		// let _document = document.implementation.createHTMLDocument();
		// let treeContainer = _document.body.createDiv();
		// treeContainer.classList.add('scroll', 'tree', 'collections');
		// // this.getCollectionsAsTree(treeContainer).then(dom => {
		// 	this.modalEl.empty();
		// 	this.collectionsSelect = new Select({
		// 		target: this.modalEl,
		// 		// props: {
		// 		// 	variable: 1
		// 		// }
		// 	});
		// this.collectionsSelect = new Flex({
		// 	target: treeContainer
		// })
		// this.modalEl.appendChild(treeContainer);
		// });
	}

	async getCollectionsAsTree(rootElement: HTMLElement) {
		this.raindropCollections = await getCollections(
			this.raindropAccessToken
		);
		return renderTreeToDOM(this.raindropCollections, rootElement);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
		contentEl.empty();

		let items = [
			{ value: "chocolate", label: "Chocolate" },
			{ value: "pizza", label: "Pizza" },
			{ value: "cake", label: "Cake" },
			{ value: "chips", label: "Chips" },
			{ value: "ice-cream", label: "Ice Cream" },
		];

		let value = { value: "cake", label: "Cake" };

		function handleSelect(event: any) {
			console.log("selected item", event.detail);
			// .. do something here 🙂
		}

		//  <!-- <Select {items} {value} on:select={handleSelect}></Select> -->

		// this.collectionsSelect = new Select({
		// 	target: contentEl,
		// 	props: {
		// 		items,
		// 		value,
		// 		action
		// 	}
		// })

		this.collectionsSelect = new Collections({
			target: contentEl,

			// props: {
			// 	variable: 1
			// }
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

/**
 * 
 * We use the *test token* from an app the user sets up themselves.
 * The only way to securely use an app otherwise would be to establish
 * a server/service for oauth to hide secret and I'm not up for supporting that.
 * 
 * https://developer.raindrop.io/v1/authentication/token
 */
class ObsidianRaindropSettingsTab extends PluginSettingTab {
	plugin: ObsidianRaindrop;

	constructor(app: App, plugin: ObsidianRaindrop) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Raindrop Settings" });

		new Setting(containerEl)
			.setName("Raindrop Test Token")
			.setDesc("Test access token used to authenticate with Raindrop.io")
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.raindropAccessToken)
					.onChange(async (value) => {
						// console.info("Raindrop Access Token: ", value);
						this.plugin.settings.raindropAccessToken = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

import {
	App,
	Editor,
	getLinkpath,
	MarkdownView,
	Menu,
	MenuItem,
	Modal,
	Notice,
	parseLinktext,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { createRaindrop, getCollections, raindropConstants } from "src/raindrop";
import { Link, RaindropCollection } from "src/types";
import { isWikiLink, getLink, renderTreeToDOM, waitingIndicatorHTML } from "src/utils";
// Remember to rename these classes and interfaces!

interface ObsidianRaindropSettings {
	raindropAccessToken: string;
}

const DEFAULT_SETTINGS: ObsidianRaindropSettings = {
	raindropAccessToken: "",
};

export default class ObsidianRaindrop extends Plugin {
	settings: ObsidianRaindropSettings;

	async onload() {
		// console.log("onload");
		await this.loadSettings();
		this.registerEvents();

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

	private handleEditorMenu(menu: Menu, editor: Editor, view: MarkdownView) {
		// Add context menu for adding selected link to raindrop
		// console.info("handleEditorMenu");
	}

	private registerEvents() {
		// console.log("registerEvents");

		// context menu
		this.app.workspace.on("editor-menu", (menu, editor: Editor, view) => {
			// console.info("context menu");
			menu.addItem((item: MenuItem) => {
				item.setTitle("Create Raindrop Bookmark").onClick((evt) => {
					this.handleCreateBookmark(editor);
				});
			});

		// protocol handler for callbacks in raindrop oauth
		// this.registerObsidianProtocolHandler(raindropConstants.OBSIDIAN_PROTOCOL_HANDLER_ACTION, handleRaindropOAuthCallback);

			// getLinkpath(currentSelection), parseLinktext(currentSelection));
			// const file = await this.createNewDiagramFile(view.file.parent);
			// editor.replaceSelection(`![[${file.path}]]`);
			// const leaf = this.app.workspace.splitActiveLeaf("horizontal");
			// await leaf.setViewState({
			// 	type: DIAGRAM_EDIT_VIEW_TYPE,
			// 	state: { file: file.path },
			// });
			// });
			// });
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
		this.registerEvent(
			this.app.workspace.on("editor-menu", this.handleEditorMenu, this)
		);
		// this.registerEvent(
		//   this.app.workspace.on("layout-change", this.handleLayoutChange, this)
		// );
	}

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
		new NewRaindropModal(this.app, this.settings.raindropAccessToken).open();
		// with tag autocomplete, etc?
		// createRaindrop(link, this.settings.raindropAccessToken);
		// get the title
		// const
	}

	// private handleRaindropOAuthCallback(params: any) {
	// 	// https://developer.raindrop.io/v1/authentication/token
	// 	console.info('handleRaindropOAuthCallback:')
	// 	// expects {code: string} or {error: string}
	// 	console.log(params);

	// 	// check for error
	// 	// 	access_denied (user says no to auth)
	// 	// 	invalid_application_status (When your application exceeds the maximum token limit or when your application is being suspended due to abuse)
	// 	const authCode = params.code || null;
	// 	console.log({authCode});
	// 	// if we have the code then we need to 
	// }
}

class NewRaindropModal extends Modal {
	raindropAccessToken: string;
	// raindropCollections: Record<string,RaindropCollection>;
	raindropCollections: any;
	selectedRaindropRootCollection: RaindropCollection;
	selectedRaindropChildCollection: RaindropCollection;

	constructor(app: App, raindropAccessToken: string) {
		super(app);

		this.raindropAccessToken = raindropAccessToken;
		this.modalEl.empty();

		this.modalEl.appendChild(waitingIndicatorHTML());

		let _document = document.implementation.createHTMLDocument();
		let treeContainer = _document.body.createDiv();
		treeContainer.classList.add('scroll', 'tree', 'collections');
		this.getCollectionsAsTree(treeContainer).then(dom => {
			this.modalEl.empty();
			this.modalEl.appendChild(treeContainer);
		});
		
	}
	
	async getCollectionsAsTree(rootElement: HTMLElement) {
		this.raindropCollections = await getCollections(this.raindropAccessToken);
		return renderTreeToDOM(this.raindropCollections, rootElement);
	}


	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

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
					.setPlaceholder('')
					.setValue(this.plugin.settings.raindropAccessToken)
					.onChange(async (value) => {
						console.log("Raindrop Access Token: ", value);
						this.plugin.settings.raindropAccessToken = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

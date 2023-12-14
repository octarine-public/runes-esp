import "./translations"

import { MenuManager } from "./menu/index"

const bootstrap = new (class CRunesESP {
	private readonly menu = new MenuManager()

	constructor() {
		this.menu.OnMenuChanged(() => this.OnMenuChanged())
	}

	protected OnMenuChanged() {
		/** @todo */
		console.log("called")
	}
})()

import "./translations"

import {
	Entity,
	EventsSDK,
	ParticlesSDK,
	RuneSpawner
} from "github.com/octarine-public/wrapper/index"

import { MenuManager } from "./menu/index"
import { RuneSpawnerData } from "./models/spawner"

const bootstrap = new (class CRunesESP {
	private readonly menu = new MenuManager()
	private readonly pSDK = new ParticlesSDK()
	private readonly runeSpawner: RuneSpawnerData[] = []

	constructor() {
		this.menu.OnMenuChanged(() => this.OnMenuChanged())
	}

	public Draw() {
		/** @todo */
	}

	public Tick(_dt: number) {
		/** @todo */
		console.log(this.runeSpawner)
	}

	public EntityCreated(entity: Entity) {
		if (entity instanceof RuneSpawner) {
			this.runeSpawner.push(new RuneSpawnerData(entity))
		}
	}

	public EntityDestroyed(entity: Entity) {
		if (entity instanceof RuneSpawner) {
			this.runeSpawner.removeCallback(x => x.Spawner === entity)
		}
	}

	protected OnMenuChanged() {
		/** @todo */
		console.log("called")
	}
})()

EventsSDK.on("Draw", () => bootstrap.Draw())

EventsSDK.on("Tick", dt => bootstrap.Tick(dt))

EventsSDK.on("EntityCreated", entity => bootstrap.EntityCreated(entity))

EventsSDK.on("EntityDestroyed", entity => bootstrap.EntityDestroyed(entity))

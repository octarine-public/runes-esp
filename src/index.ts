import "./translations"

import {
	DOTAGameState,
	DOTAGameUIState,
	Entity,
	EventsSDK,
	Fountain,
	GameRules,
	GameState,
	Rune,
	RuneSpawner,
	RuneSpawnerType,
	Unit,
	WardObserver
} from "github.com/octarine-public/wrapper/index"

import { MenuManager } from "./menu/index"
import { PSDK } from "./models/pSDK"
import { RuneSpawnerData } from "./models/spawner"

const bootstrap = new (class CRunesESP {
	private readonly pSDK = new PSDK()
	private readonly menu = new MenuManager()

	private readonly units: Unit[] = []
	private readonly dataSpawners: RuneSpawnerData[] = []

	constructor() {
		this.menu.OnMenuChanged(() => this.OnMenuChanged())
	}

	private get isInGame() {
		if (GameState.UIState !== DOTAGameUIState.DOTA_GAME_UI_DOTA_INGAME) {
			return false
		}
		const gamestate = GameRules?.GameState ?? DOTAGameState.DOTA_GAMERULES_STATE_INIT
		return (
			gamestate >= DOTAGameState.DOTA_GAMERULES_STATE_PRE_GAME ||
			gamestate <= DOTAGameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS
		)
	}

	public Draw() {
		if (!this.isInGame || !this.menu.State.value) {
			return
		}
		const array = this.dataSpawners
		for (let index = array.length - 1; index > -1; index--) {
			array[index].Draw(this.menu, this.units)
		}
	}

	public Tick(dt: number) {
		if (GameRules === undefined) {
			return
		}

		const arr = this.dataSpawners
		const gameTime = GameRules.GameTime

		for (let index = arr.length - 1; index > -1; index--) {
			const data = arr[index]
			if (gameTime <= dt) {
				// this.CreateFakeRune(data, DOTA_RUNES.DOTA_RUNE_BOUNTY, true)
				continue
			}
			// if (data.IsVisible) {
			// 	data.DestroyFakeRunes()
			// }
			switch (data.SpawnerType) {
				case RuneSpawnerType.Bounty:
					// this.BountyRuneTick(data)
					break
				case RuneSpawnerType.Pwowerup:
					// this.PowerupRuneTick(data)
					break
				default:
					// this.XPRuneTick(data)
					break
			}
		}
	}

	public GameChanged() {
		RuneSpawnerData.Sleeper.FullReset()
	}

	public EntityCreated(entity: Entity) {
		if (entity instanceof Fountain && !entity.IsEnemy()) {
			PSDK.attach = entity
		}
		if (entity instanceof RuneSpawner) {
			this.dataSpawners.push(
				new RuneSpawnerData(entity).UpdateRuneData(this.menu, this.pSDK)
			)
		}
		if (!(entity instanceof Unit || entity instanceof Rune)) {
			return
		}
		if (this.isValidUnit(entity) && !entity.IsEnemy()) {
			this.units.push(entity)
		}
		if (!(entity instanceof Rune)) {
			return
		}
		const spawnerData = this.dataSpawners.find(x => x.HasRunePosition(entity))
		if (spawnerData !== undefined) {
			spawnerData.AddRune(entity, this.menu, this.pSDK)
		}
	}

	public EntityDestroyed(entity: Entity) {
		if (entity instanceof RuneSpawner) {
			this.DestroySpawner(entity)
		}
		if (entity instanceof Fountain && PSDK.attach === entity) {
			PSDK.attach = undefined
		}
		if (!(entity instanceof Unit || entity instanceof Rune)) {
			return
		}
		if (this.isValidUnit(entity)) {
			this.units.remove(entity)
		}
		if (entity instanceof Rune) {
			this.getSpawnerByRune(entity)?.DestroyRune(entity, this.pSDK)
		}
	}

	public EntityVisibleChanged(entity: Entity) {
		if (entity instanceof Rune) {
			this.getSpawnerByRune(entity)?.VisibleChanged(entity, this.menu, this.pSDK)
		}
	}

	protected OnMenuChanged() {
		const array = this.dataSpawners
		for (let index = array.length - 1; index > -1; index--) {
			array[index].UpdateMenu(this.menu, this.pSDK)
		}
	}

	protected UpdateTickSpawner() {
		/** @todo */
	}

	protected DestroySpawner(entity: RuneSpawner) {
		const spawner = this.dataSpawners.find(data => data.Spawner === entity)
		if (spawner !== undefined) {
			spawner.DestroyAllRuneBySpawner(this.pSDK)
			this.dataSpawners.remove(spawner)
		}
	}

	private isValidUnit(entity: Entity): entity is Unit {
		return (
			(entity instanceof Unit || entity instanceof WardObserver) &&
			(entity.IsHero || entity.IsCreep || entity.IsTower || entity.IsSpiritBear)
		)
	}

	private getSpawnerByRune(entity: Rune) {
		return this.dataSpawners.find(data => data.Runes.get(entity))
	}
})()

EventsSDK.on("Draw", () => bootstrap.Draw())

EventsSDK.on("Tick", dt => bootstrap.Tick(dt))

EventsSDK.on("GameEnded", () => bootstrap.GameChanged())

EventsSDK.on("GameStarted", () => bootstrap.GameChanged())

EventsSDK.on("EntityCreated", entity => bootstrap.EntityCreated(entity))

EventsSDK.on("EntityDestroyed", entity => bootstrap.EntityDestroyed(entity))

EventsSDK.on("EntityVisibleChanged", entity => bootstrap.EntityVisibleChanged(entity))

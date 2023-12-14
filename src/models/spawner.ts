import {
	Color,
	DOTAGameState,
	EntityManager,
	GameRules,
	GameSleeper,
	GameState,
	GUIInfo,
	Input,
	MinimapSDK,
	Rectangle,
	RendererSDK,
	Rune,
	RuneSpawner,
	RuneSpawnerBounty,
	RuneSpawnerPowerup,
	RuneSpawnerType,
	RuneSpawnerXP,
	SoundSDK,
	TextFlags,
	Unit,
	Vector2,
	Vector3,
	VKeys
} from "github.com/octarine-public/wrapper/index"

import { MenuManager } from "../menu"
import { PSDK } from "./pSDK"
import { FakeRune, RuneData } from "./rune"

const runes = EntityManager.GetEntitiesByClass(Rune)

export class RuneSpawnerData {
	public static readonly Sleeper = new GameSleeper()
	public readonly Position = new Vector3().Invalidate()
	public readonly Runes = new Map<Rune | FakeRune, RuneData>()
	public readonly SpawnerType: RuneSpawnerType = RuneSpawnerType.XP

	constructor(public readonly Spawner: RuneSpawner) {
		if (
			Spawner instanceof RuneSpawnerXP ||
			Spawner instanceof RuneSpawnerBounty ||
			Spawner instanceof RuneSpawnerPowerup
		) {
			this.SpawnerType = Spawner.Type
		}

		this.Position.CopyFrom(Spawner.Position).SubtractScalarZ(65)
	}

	// TODO: need add nav visible mesh
	public IsVisible(_units: Unit[]) {
		return false
	}

	protected get Key() {
		return `${this.Spawner.Index}_${this.Spawner.Name}`
	}

	public Draw(menu: MenuManager, units: Unit[]) {
		this.Runes.forEach(data => data.Draw(menu))

		if (GameRules === undefined || !menu.SpawnState.value) {
			return
		}
		const w2s = RendererSDK.WorldToScreen(this.Position)
		if (w2s === undefined) {
			return
		}
		if (this.IsVisible(units) && !Input.IsKeyDown(VKeys.MENU)) {
			return
		}

		const size = menu.SpawnSizeTime.value + 24
		const w2size = new Vector2(GUIInfo.ScaleWidth(size), GUIInfo.ScaleHeight(size))
		const w2sPosition = w2s.SubtractForThis(w2size.DivideScalar(2))
		const position = new Rectangle(w2sPosition, w2sPosition.Add(w2size))

		if (
			this.SpawnerType === RuneSpawnerType.XP &&
			GameRules.GameState !== DOTAGameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS
		) {
			return
		}

		const text =
			this.Spawner.Remaining < 1
				? this.Spawner.Remaining.toFixed(1)
				: this.Spawner.Remaining.toFixed()

		RendererSDK.TextByFlags(
			text,
			position,
			Color.White,
			2,
			TextFlags.Center,
			600,
			RendererSDK.DefaultFontName,
			true,
			false,
			true,
			true
		)
	}

	public VisibleChanged(rune: Rune, menu: MenuManager, pSDK: PSDK) {
		this.Runes.get(rune)?.VisiblityChanged(menu, pSDK)
	}

	public HasRunePosition(rune: Rune | FakeRune) {
		return (
			this.Position.Equals(rune.Position) ||
			this.Position.Distance2D(rune.Position) <= 450
		)
	}

	public AddRune(rune: Rune | FakeRune, menu: MenuManager, pSDK: PSDK) {
		if (rune instanceof Rune) {
			this.destroyFakeRune(rune)
		}
		const instance = new RuneData(rune, this.Spawner.Handle, rune.Position)
		this.Runes.set(rune, instance.Update(menu, pSDK))
	}

	public DestroyRune(rune: Rune | FakeRune, pSDK: PSDK) {
		this.Runes.get(rune)?.Destroy(pSDK)
		this.Runes.delete(rune)
	}

	public DestroyAllRuneBySpawner(pSDK: PSDK) {
		this.Runes.forEach(data => this.DestroyRune(data.rune, pSDK))
	}

	public UpdateMenu(menu: MenuManager, pSDK: PSDK) {
		this.Runes.forEach(data => data.Update(menu, pSDK))
	}

	public UpdateRuneData(menu: MenuManager, pSDK: PSDK) {
		const rune = runes.find(x => this.HasRunePosition(x))
		if (rune !== undefined && rune.IsValid) {
			this.AddRune(rune, menu, pSDK)
		}
		return this
	}

	public SentNotification(menu: MenuManager) {
		const time = menu.DisableNotificatioTime.value
		const isDisabletime = time === 0 || (GameState.RawGameTime - 95) / 60 <= time
		const state = menu.State.value && menu.PingMiniMap.value
		if (!state || !isDisabletime || RuneSpawnerData.Sleeper.Sleeping(this.Key)) {
			return
		}
		SoundSDK.EmitStartSoundEvent("General.Ping")
		MinimapSDK.DrawPing(this.Position, Color.White, GameState.RawGameTime + 7)
		RuneSpawnerData.Sleeper.Sleep(7 * 1000, this.Key)
	}

	// TODO: need add nav visible mesh
	private destroyFakeRune(_realRune?: Rune, _position?: Vector3) {
		// this.Runes.forEach(data => {
		// 	const rune = data.rune
		// 	if (!(rune instanceof FakeRune)) {
		// 		return
		// 	}
		// 	const polygon = new PCircle(position ?? this.Spawner, 450)
		// 	if (polygon.IsInside(realRune?.Position ?? rune.Position)) {
		// 		this.DestroyRune(rune)
		// 	}
		// })
	}
}

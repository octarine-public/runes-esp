import {
	Color,
	DOTA_RUNES,
	GUIInfo,
	ImageData,
	MinimapSDK,
	Rectangle,
	RendererSDK,
	Rune,
	Vector2,
	Vector3
} from "github.com/octarine-public/wrapper/index"

import { MenuManager } from "../menu"
import { PSDK } from "./pSDK"

export class FakeRune {
	constructor(
		public readonly Type = DOTA_RUNES.DOTA_RUNE_BOUNTY,
		public readonly Index: number,
		public Position: Vector3
	) {}

	public get Name() {
		switch (this.Type) {
			case DOTA_RUNES.DOTA_RUNE_DOUBLEDAMAGE:
				return "doubledamage"
			case DOTA_RUNES.DOTA_RUNE_HASTE:
				return "haste"
			case DOTA_RUNES.DOTA_RUNE_ILLUSION:
				return "illusion"
			case DOTA_RUNES.DOTA_RUNE_INVISIBILITY:
				return "invis"
			case DOTA_RUNES.DOTA_RUNE_REGENERATION:
				return "regen"
			case DOTA_RUNES.DOTA_RUNE_BOUNTY:
				return "bounty"
			case DOTA_RUNES.DOTA_RUNE_ARCANE:
				return "arcane"
			case DOTA_RUNES.DOTA_RUNE_WATER:
				return "water"
			case DOTA_RUNES.DOTA_RUNE_XP:
				return "xp"
			case DOTA_RUNES.DOTA_RUNE_SHIELD:
				return "shield"
			default:
				return "unknown"
		}
	}

	public get IsVisible() {
		return false
	}

	public get ModelScale() {
		return 1
	}

	public Distance2D(vec: Vector3): number {
		return this.Position.Distance2D(vec)
	}
}

export class RuneData {
	constructor(
		public readonly rune: Rune | FakeRune,
		_spawnerIndex: number,
		public readonly Position: Vector3
	) {
		this.Position.CopyFrom(rune.Position)
	}

	public get Key() {
		return `rune_${this.rune.Index}_${this.rune.Name}`
	}

	public Draw(menuManager: MenuManager) {
		if (!this.IsEnabled(menuManager)) {
			return
		}
		const w2s = RendererSDK.WorldToScreen(this.Position)
		if (w2s === undefined) {
			return
		}
		const menu = menuManager.RuneTypeMenu.get(this.rune.Type)
		if (menu === undefined) {
			return
		}
		const size = menu.ImageSize.value + 30
		const w2size = new Vector2(GUIInfo.ScaleWidth(size), GUIInfo.ScaleHeight(size))
		const w2sPosition = w2s.SubtractForThis(w2size.DivideScalar(2))
		const position = new Rectangle(w2sPosition, w2sPosition.Add(w2size))
		const image = ImageData.GetRuneTexture(this.rune.Name)
		RendererSDK.Image(image, position.pos1, -1, position.Size)
	}

	public Update(menu: MenuManager, pSDK: PSDK) {
		this.UpdateMiniMap(menu)
		this.Update3DModel(menu, pSDK)
		return this
	}

	public Destroy(pSDK: PSDK) {
		pSDK.DestroyByKey(this.Key)
	}

	public VisiblityChanged(menu: MenuManager, pSDK: PSDK) {
		if (!this.rune.IsVisible) {
			this.Update(menu, pSDK)
			return
		}
		this.Destroy(pSDK)
		this.UpdateMiniMap(menu)
	}

	protected IsEnabled(menu: MenuManager, isModel3D = false) {
		const getMenu = menu.RuneTypeMenu.get(this.rune.Type)
		if (!menu.State.value || this.rune.IsVisible || getMenu === undefined) {
			return false
		}
		if (!getMenu.State.value) {
			return false
		}
		return (
			(isModel3D && getMenu.Mode.SelectedID === 1) ||
			(!isModel3D && getMenu.Mode.SelectedID === 0)
		)
	}

	protected Update3DModel(menu: MenuManager, pSDK: PSDK) {
		if (!this.IsEnabled(menu, true)) {
			this.Destroy(pSDK)
			return
		}
		pSDK.CreateRune(this.Key, this.rune.Type, this.Position)
	}

	protected UpdateMiniMap(menu: MenuManager) {
		const key = this.Key
		const state = menu.State.value
		const isVisible = this.rune.IsVisible
		const getMenu = menu.RuneTypeMenu.get(this.rune.Type)
		if (!state || isVisible || getMenu === undefined || !getMenu.State.value) {
			MinimapSDK.DeleteIcon(key)
			return
		}

		const name = this.rune.Name
		const runeName = `rune_${name.includes("doubledamage") ? "dd" : name}`

		MinimapSDK.DrawIcon(
			runeName,
			this.Position,
			350,
			Color.White,
			Number.MAX_SAFE_INTEGER,
			key,
			350,
			0,
			-1
		)
	}
}

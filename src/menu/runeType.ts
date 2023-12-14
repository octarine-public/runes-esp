import { DOTA_RUNES, ImageData, Menu } from "github.com/octarine-public/wrapper/index"

export class MenuRuneType {
	public readonly Mode: Menu.Dropdown
	public readonly State: Menu.Toggle
	public readonly ImageSize: Menu.Slider

	protected readonly Tree: Menu.Node

	constructor(
		public readonly Type: DOTA_RUNES,
		node: Menu.Node,
		nodeName: string
	) {
		this.Tree = node.AddNode(nodeName, ImageData.GetRuneTexture(this.RuneName), "", 0)

		this.State = this.Tree.AddToggle("State", true)
		this.Mode = this.Tree.AddDropdown("Display mode", ["2D", "3D"], 0)
		this.ImageSize = this.Tree.AddSlider("Size", 10, 0, 30)
		this.ImageSize.IsHidden = true

		this.Mode.OnValue(call => {
			this.ImageSize.IsHidden = call.SelectedID !== 0
			this.ImageSize.Update()
			this.Tree.Update()
		})
	}

	public get RuneName() {
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

	public OnMenuChanged(callback: () => void) {
		this.Mode.OnValue(() => callback())
		this.State.OnValue(() => callback())
		this.ImageSize.OnValue(() => callback())
	}
}

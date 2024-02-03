import { DOTA_RUNES, ImageData, Menu } from "github.com/octarine-public/wrapper/index"

export class MenuRuneType {
	public readonly Mode: Menu.Dropdown
	public readonly State: Menu.Toggle
	public readonly ImageSize: Menu.Slider

	protected readonly Tree: Menu.Node

	private static readonly RuneNames: { [key: number]: string } = {
		[-1]: "unknown",
		[0]: "doubledamage",
		[1]: "haste",
		[2]: "illusion",
		[3]: "invis",
		[4]: "regen",
		[5]: "bounty",
		[6]: "arcane",
		[7]: "water",
		[8]: "xp",
		[9]: "shield"
	}

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

	public get RuneName(): string {
		return MenuRuneType.RuneNames[this.Type] || "unknown"
	}

	public OnMenuChanged(callback: () => void) {
		this.Mode.OnValue(() => callback())
		this.State.OnValue(() => callback())
		this.ImageSize.OnValue(() => callback())
	}
}

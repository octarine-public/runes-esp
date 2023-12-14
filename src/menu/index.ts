import { DOTA_RUNES, ImageData, Menu } from "github.com/octarine-public/wrapper/index"

import { MenuRuneType } from "./runeType"

export class MenuManager {
	public readonly State: Menu.Toggle
	public readonly SpawnState: Menu.Toggle
	public readonly PingMiniMap: Menu.Toggle
	public readonly DisableNotificatioTime: Menu.Slider

	public readonly RuneTypeMenu = new Map<DOTA_RUNES, MenuRuneType>()

	private readonly runeDataMenu = [
		{
			nodeName: "RUNE_WORD_v1_Rune_Double_Damage",
			runeType: DOTA_RUNES.DOTA_RUNE_DOUBLEDAMAGE
		},
		{
			nodeName: "RUNE_WORD_v1_Rune_Arcane",
			runeType: DOTA_RUNES.DOTA_RUNE_ARCANE
		},
		{
			nodeName: "RUNE_WORD_v1_Rune_Bounty",
			runeType: DOTA_RUNES.DOTA_RUNE_BOUNTY
		},
		{
			nodeName: "RUNE_WORD_v1_Rune_Haste",
			runeType: DOTA_RUNES.DOTA_RUNE_HASTE
		},
		{
			nodeName: "RUNE_WORD_v1_Rune_Illusion",
			runeType: DOTA_RUNES.DOTA_RUNE_ILLUSION
		},
		{
			nodeName: "RUNE_WORD_v1_Rune_Invisibility",
			runeType: DOTA_RUNES.DOTA_RUNE_INVISIBILITY
		},
		{
			nodeName: "RUNE_WORD_v1_Rune_Regeneration",
			runeType: DOTA_RUNES.DOTA_RUNE_REGENERATION
		},
		{
			nodeName: "RUNE_WORD_v1_Rune_Shield",
			runeType: DOTA_RUNES.DOTA_RUNE_SHIELD
		},
		{
			nodeName: "RUNE_WORD_v1_Rune_Water",
			runeType: DOTA_RUNES.DOTA_RUNE_WATER
		},
		{
			nodeName: "RUNE_WORD_v1_Rune_Xp",
			runeType: DOTA_RUNES.DOTA_RUNE_XP
		}
	]

	constructor() {
		const treeEntry = Menu.AddEntry("Visual")
		const tree = treeEntry.AddNode("Runes", ImageData.GetRuneTexture("bounty"))

		tree.SortNodes = false

		this.State = tree.AddToggle(
			"RUNE_WORD_v1_State",
			true,
			"RUNE_WORD_v1_State_ToolTip"
		)

		this.SpawnState = tree.AddToggle(
			"RUNE_WORD_v1_Spawn_Time",
			true,
			"RUNE_WORD_v1_Spawn_Time_Tooltip"
		)

		this.PingMiniMap = tree.AddToggle(
			"RUNE_WORD_v1_Ping_Minimap",
			false,
			"RUNE_WORD_v1_Ping_Minimap_Tooltip"
		)

		this.DisableNotificatioTime = tree.AddSlider(
			"RUNE_WORD_v1_Ping_Minimap_Turn_Off_By_Time",
			15,
			5,
			60,
			0,
			"RUNE_WORD_v1_Ping_Minimap_Turn_Off_By_Time_Tooltip"
		)

		this.CreateMenuRuneTypes(tree)
	}

	public OnMenuChanged(callback: () => void) {
		this.State.OnValue(() => callback())
		this.SpawnState.OnValue(() => callback())
		this.DisableNotificatioTime.OnValue(() => callback())
		this.RuneTypeMenu.forEach(runeType => runeType.OnMenuChanged(() => callback()))
		this.PingMiniMap.OnValue(call => {
			callback()
			this.DisableNotificatioTime.IsHidden = !call.value
		})
	}

	protected CreateMenuRuneTypes(node: Menu.Node) {
		for (let index = 0; index < this.runeDataMenu.length; index++) {
			const runeMenu = this.runeDataMenu[index]
			const nodeName = runeMenu.nodeName
			const runeType = runeMenu.runeType
			this.RuneTypeMenu.set(runeType, new MenuRuneType(runeType, node, nodeName))
		}
	}
}

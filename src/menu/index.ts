import { DOTA_RUNES, ImageData, Menu } from "github.com/octarine-public/wrapper/index"

import { MenuRuneType } from "./runeType"

export class MenuManager {
	public readonly State: Menu.Toggle
	public readonly SpawnState: Menu.Toggle
	public readonly PingMiniMap: Menu.Toggle
	public readonly SpawnSizeTime: Menu.Slider
	public readonly DisableNotificatioTime: Menu.Slider

	public readonly RuneTypeMenu = new Map<DOTA_RUNES, MenuRuneType>()

	private readonly tree: Menu.Node
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
		this.tree = treeEntry.AddNode("Runes", ImageData.GetRuneTexture("bounty"))

		this.tree.SortNodes = false

		this.State = this.tree.AddToggle(
			"RUNE_WORD_v1_State",
			true,
			"RUNE_WORD_v1_State_ToolTip"
		)

		this.SpawnState = this.tree.AddToggle(
			"RUNE_WORD_v1_Spawn_Time",
			true,
			"RUNE_WORD_v1_Spawn_Time_Tooltip"
		)

		this.PingMiniMap = this.tree.AddToggle(
			"RUNE_WORD_v1_Ping_Minimap",
			false,
			"RUNE_WORD_v1_Ping_Minimap_Tooltip"
		)

		this.SpawnSizeTime = this.tree.AddSlider(
			"RUNE_WORD_v1_Spawn_Time_Size",
			0,
			0,
			30,
			0,
			"RUNE_WORD_v1_Spawn_Time_Size_Tooltip"
		)

		this.DisableNotificatioTime = this.tree.AddSlider(
			"RUNE_WORD_v1_Ping_Minimap_Turn_Off_By_Time",
			15,
			5,
			60,
			0,
			"RUNE_WORD_v1_Ping_Minimap_Turn_Off_By_Time_Tooltip"
		)

		this.CreateMenuRuneTypes(this.tree)
	}

	public OnMenuChanged(callback: () => void) {
		this.State.OnValue(() => callback())
		this.SpawnSizeTime.OnValue(() => callback())
		this.DisableNotificatioTime.OnValue(() => callback())
		this.RuneTypeMenu.forEach(runeType => runeType.OnMenuChanged(() => callback()))

		this.SpawnState.OnValue(call => {
			callback()
			this.SpawnSizeTime.IsHidden = !call.value
			this.tree.Update()
		})

		this.PingMiniMap.OnValue(call => {
			callback()
			this.DisableNotificatioTime.IsHidden = !call.value
			this.tree.Update()
		})
	}

	protected CreateMenuRuneTypes(node: Menu.Node) {
		for (const runeMenu of this.runeDataMenu) {
			const { nodeName, runeType } = runeMenu
			this.RuneTypeMenu.set(runeType, new MenuRuneType(runeType, node, nodeName))
		}
	}
}

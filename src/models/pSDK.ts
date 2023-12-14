import {
	DOTA_RUNES,
	Fountain,
	ParticleAttachment,
	ParticlesSDK,
	Vector3
} from "github.com/octarine-public/wrapper/index"

export class PSDK extends ParticlesSDK {
	public static attach: Nullable<Fountain>

	public CreateRune(key: string, runeType: DOTA_RUNES, position: Vector3) {
		if (PSDK.attach === undefined) {
			return
		}
		const endName = "rune.vpcf"
		const basePath = "github.com/octarine-public/runes-esp"
		let path = basePath + "/scripts_files/particles/"
		switch (runeType) {
			case DOTA_RUNES.DOTA_RUNE_DOUBLEDAMAGE:
				path = `${path}doubledamage/${endName}`
				break
			case DOTA_RUNES.DOTA_RUNE_HASTE:
				path = `${path}haste/${endName}`
				break
			case DOTA_RUNES.DOTA_RUNE_ILLUSION:
				path = `${path}illusion/${endName}`
				break
			case DOTA_RUNES.DOTA_RUNE_INVISIBILITY:
				path = `${path}invis/${endName}`
				break
			case DOTA_RUNES.DOTA_RUNE_REGENERATION:
				path = `${path}regen/${endName}`
				break
			case DOTA_RUNES.DOTA_RUNE_BOUNTY:
				path = `${path}bounty/${endName}`
				break
			case DOTA_RUNES.DOTA_RUNE_ARCANE:
				path = `${path}arcane/${endName}`
				break
			case DOTA_RUNES.DOTA_RUNE_WATER:
				path = `${path}water/${endName}`
				break
			case DOTA_RUNES.DOTA_RUNE_XP:
				path = `${path}xp/${endName}`
				break
			case DOTA_RUNES.DOTA_RUNE_SHIELD:
				path = `${path}shield/${endName}`
				break
		}

		return this.AddOrUpdate(
			key,
			path,
			ParticleAttachment.PATTACH_ABSORIGIN,
			PSDK.attach,
			[0, position],
			runeType === DOTA_RUNES.DOTA_RUNE_REGENERATION ||
				runeType === DOTA_RUNES.DOTA_RUNE_WATER
				? [11, 1]
				: [4, 1]
		)
	}
}

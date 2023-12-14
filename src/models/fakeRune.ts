import { DOTA_RUNES, Vector3 } from "github.com/octarine-public/wrapper/index"

export class FakeRune {
	constructor(
		public readonly Type = DOTA_RUNES.DOTA_RUNE_BOUNTY,
		public readonly Handle: number,
		public Position: Vector3
	) {}

	public get IsVisible() {
		return false
	}

	public get ModelScale() {
		return 1
	}

	public Distance(vec: Vector3): number {
		return this.Position.Distance(vec)
	}

	public Distance2D(vec: Vector3): number {
		return this.Position.Distance2D(vec)
	}
}

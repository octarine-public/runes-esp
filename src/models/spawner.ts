import { Rune, RuneSpawner } from "github.com/octarine-public/wrapper/index"

import { FakeRune } from "./fakeRune"
import { RuneData } from "./rune"

export class RuneSpawnerData {
	protected readonly Runes = new Map<Rune | FakeRune, RuneData>()

	constructor(public readonly Spawner: RuneSpawner) {}

	public AddRune(_rune: Rune | FakeRune) {
		/** @todo */
	}

	public Draw() {
		/** @todo */
	}

	public VisibleChanged(_rune: Rune) {
		/** @todo */
	}
}

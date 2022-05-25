import { effect } from "./effect";

class ComputedRefsImp {
	private _lazy = true;
	private _value = null;
	private _effect: any;
	constructor(private getters: Function) {
		this._effect = effect(getters, {
			scheduler: () => {
				if (!this._lazy) {
					this._lazy = true;
				}
			}
		});
	}

	get value() {
		if (this._lazy) {
			this._lazy = false;
			this._value = this._effect();
		}
		return this._value;
	}
}

export function computed(getters: Function) {
	return new ComputedRefsImp(getters);
}

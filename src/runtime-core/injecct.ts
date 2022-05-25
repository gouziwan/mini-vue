import { getCurrentInstace } from "./component";

export function provide(key: string, value: any) {
	const current = getCurrentInstace();
	const { provides } = current;
	if (current) {
		if (provides === current.parent?.provides) {
			// 这里是创建一个原型链的东西
			current.provides = Object.create(provides);
		}
		current.provides[key] = value;
	}
}

export function inject(key: string, defaultValue?: any) {
	const current = getCurrentInstace();
	const { parent } = current;
	if (parent) {
		let val = parent.provides[key];
		return val == undefined ? defaultValue : val;
	}
}

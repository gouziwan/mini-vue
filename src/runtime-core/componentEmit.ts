import { camelize, toCapitalizeisOn } from "../utils";

export function emit(install: ComponentInstance) {
	return function (event: string, ...args: any[]) {
		let eventName = toCapitalizeisOn(camelize(event));
		let fun = install.on![eventName];
		fun && fun(...args);
	};
}

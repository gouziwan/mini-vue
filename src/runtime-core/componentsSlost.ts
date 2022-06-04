import { isFunction, isObject } from "../utils";

// 初始化插槽
export function initSlost(instace: ComponentInstance) {
	if (!isObject(instace._vnode.children)) return;

	let slost = instace._vnode.children!;

	for (let k in slost) {
		instace.$slots[k] = slost[k];
	}
}

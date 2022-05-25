import { reactiveHanders, readonlyHanders, shallowReadonlyHanders } from "./baseHandlers";

export const enum ReactiveConst {
	IS_REACTIVE = "_v_isReactive",
	IS_READONLY = "_v_isReadonly"
}

export function reactive(raw: any) {
	return new Proxy(raw, reactiveHanders);
}

// 只读对象
export function readonly(raw: any) {
	return new Proxy(raw, readonlyHanders);
}

export function isReactive(target: any) {
	return !!target[ReactiveConst.IS_REACTIVE];
}

export function isReadonly(target: any) {
	return !!target[ReactiveConst.IS_READONLY];
}
export function shallowReadonly(raw: any) {
	return new Proxy(raw, shallowReadonlyHanders);
}

export function isProxy(raw: any) {
	return isReactive(raw) || isReadonly(raw);
}

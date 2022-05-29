import { extend, isObject } from "./../utils/index";
import { track, trigger } from "./effect";
import { reactive, ReactiveConst, readonly } from "./reactive";
// 这里是做一个代码的优化 然后 这个高阶函数只会调用一次
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

// 这里是抽离公共代码
function createGetter(isReadonly = false, isShallow = false) {
	return function (target: any, key: string) {
		if (key === ReactiveConst.IS_REACTIVE) return !isReadonly;
		if (key === ReactiveConst.IS_READONLY) return isReadonly;

		let res = Reflect.get(target, key);

		if (isShallow) return res;

		if (isObject(res)) {
			res = isReadonly ? readonly(res) : reactive(res);
			Reflect.set(target, key, res);
		}
		// 依赖收集的
		if (!isReadonly) {
			track(target, key);
		}

		return res;
	};
}

function createSetter() {
	return function (target: any, key: string, value: any) {
		const res = Reflect.set(target, key, value);
		// 触发依赖
		trigger(target, key);
		return res;
	};
}

export const reactiveHanders = {
	get,
	// tanget当前的对象 key就是 对象的 k
	set
};

export const readonlyHanders = {
	get: readonlyGet,
	set() {
		console.warn(`当前对象只是只读不能修改`);
		return true;
	}
};

export const shallowReadonlyHanders = extend({}, readonlyHanders, {
	get: shallowReadonlyGet
});

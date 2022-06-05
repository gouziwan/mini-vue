import { extend } from "../utils";

// 这个就是用依赖的收集了
export class ReactiveEffect {
	public _dep: any[] = [];

	public active = true;

	public onStop: Function | undefined;

	constructor(public _fn: any, public scheduler?: Function | undefined) {
		this._fn = _fn;
	}

	run() {
		return this._fn();
	}

	stop() {
		if (this.active) {
			clearEffect(this);
			// 这个是在取消了onStop
			if (this.onStop) this.onStop();
			this.active = false;
		}
	}
}

function clearEffect(effect: ReactiveEffect) {
	effect._dep.forEach(dep => {
		dep.delete(effect);
	});
}

const targetMap = new WeakMap();

// 这里存储的是当前的运行的effect 函数这个收集依赖用的
let currentEffect: ReactiveEffect | null = null;

export function effect(fn: any, options?: EffectScheduler) {
	const _effect = new ReactiveEffect(fn);
	extend(_effect, options);
	// 第一次去执行他 就是收集依赖
	currentEffect = _effect;
	// 执行run函数 你要只一触发他的依赖 就是 age.xxx 他就会收集到当前的依赖
	_effect.run();
	// 等 run函数执行完毕
	const runner: any = _effect.run.bind(_effect);
	runner.effect = _effect;
	return runner;
}

// 用于依赖收集
export function track(target: Object, key: string) {
	// 用对象存储他的key
	let depMap = targetMap.get(target);

	if (!depMap) {
		depMap = new Map();
		targetMap.set(target, depMap);
	}

	let _dep = depMap.get(key);

	if (!_dep) {
		_dep = new Set();
		depMap.set(key, _dep);
	}
	// 把当前的响应式对象push进去

	if (currentEffect != null) {
		_dep.add(currentEffect);
		currentEffect._dep.push(_dep);
	}
}

// 触发依赖的进行更新
export function trigger(target: Object, key: string) {
	let depMap = targetMap.get(target);

	if (!depMap) return;

	let _dep = depMap.get(key);

	if (!_dep) return;

	_dep.forEach((effect: ReactiveEffect) => {
		effect.scheduler ? effect.scheduler() : effect.run();
	});
}

export function stop(fn: any) {
	fn.effect.stop();
}

export function watchEffect(_fn: Function) {
	effect(_fn);
}

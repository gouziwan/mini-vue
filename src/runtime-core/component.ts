import { isObject } from "./../utils/index";
import { readonly } from "../reactivity/reactive";
import { initProps } from "./componentProps";
import { emit } from "./componentEmit";
import { initSlost } from "./componentsSlost";
import { addInstaceMap } from "./createApp";

let currentInstace = null as any;

// 创建一个组件的实例对象
export function createComponentInstall(vnode: VNode, parent: ComponentInstance) {
	const instace: ComponentInstance = {
		_vnode: vnode,
		_component: vnode.type,
		state: {},
		_render: null,
		_ctx: null,
		props: readonly({}),
		emit,
		$slots: {},
		provides: parent?.provides ? parent.provides : {},
		parent
	};

	instace.emit = emit;

	return instace;
}

// 这个函数是初始化 setupComponent函数
export function setupComponent(instace: ComponentInstance) {
	// 初始化props
	initProps(instace);
	// 初始化插槽
	initSlost(instace);
	setupStateComponent(instace);
}

// 初始化props

// 调用 setup是先初始化 数据然后在渲染的
export function setupStateComponent(instace: ComponentInstance) {
	// 取出 节点
	// 判断 setup 是否存在
	const {
		_component: { setup }
	} = instace;
	if (setup) {
		handleSetupResult(instace);
	}

	finishComponentSetup(instace);
	// 这里是实例化 ctx上下文的 主要是 render函数渲染的 proxy 上下文
	instace._ctx = createContent(instace);
}

// 这个是处理 setup 不同的形式的 比如 return 可以是一个object 也可以是一个函数
export function handleSetupResult(instace: ComponentInstance) {
	if (isObject(instace)) {
		currentInstace = instace;
		// setup里面还传递props 但是现在这里先不做处理
		let state = instace._component.setup(instace.props, {
			emit: instace.emit(instace),
			attr: instace.attr
		});
		if (!isObject(state)) {
			console.warn(`setup函数 返回值不能为${state}`);
			state = {};
		}
		instace.state = state;
		currentInstace = null;
	}
}

// 这个函数用于判断 是否存在 render函数 或者template模板 template模板后面处理
export function finishComponentSetup(instace: ComponentInstance) {
	if (!instace._render) {
		if (instace._component.render) {
			instace._render = instace._component.render;
		} else {
			throw new Error("组件缺少render函数");
		}
	}
}

export function createContent(install: ComponentInstance) {
	const { state, props } = install;

	const ctx = {
		$el: (install: ComponentInstance) => install.$el,
		$slots: (install: ComponentInstance) => install.$slots
	};

	const value = {
		...state,
		...props
	};

	return new Proxy(
		{},
		{
			get(target, key) {
				if (key in value) {
					return value[key];
				}
				if (key in ctx) {
					return ctx[key as keyof typeof ctx](install);
				}

				return undefined;
			}
		}
	);
}

export function onMounted(callback: Function) {
	addInstaceMap(currentInstace);
	currentInstace.mounted = callback;
}

export function getCurrentInstace() {
	return currentInstace;
}

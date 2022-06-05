import { reactive, readonly } from "../reactivity/reactive";
import { isArray, isFunction, isKeyEvent, isObject } from "./../utils/index";

export function initProps(instace: ComponentInstance) {
	// 如果不存在 没必要循环
	if (!instace._vnode.props) return;

	const parameter = getParameter(instace);

	const data = {
		on: {},
		props: {},
		attr: {}
	};

	withProps(data, parameter, instace);

	// 设置为只读对象
	data.props = reactive(data.props);

	data.attr = reactive(data.attr);
	return data;
}

function getParameter(instace: ComponentInstance) {
	return isArray(instace._component.props)
		? [...instace._component.props]
		: isObject(instace._component.props)
		? Object.keys(instace._component.props)
		: [];
}

function withProps(data: any, parameter: any, instace: ComponentInstance) {
	const props = instace._vnode.props!;
	Object.keys(props).forEach(key => {
		// 说明这个属性为props 属性
		if (parameter.indexOf(key) !== -1) {
			disposeProps(instace, data, key);
		} else if (isKeyEvent(key)) {
			disposeEvent(props, data, key);
		} else {
			disposeArtt(props, data, key);
		}
	});
}

function disposeProps(instace: any, data: any, key: string) {
	let com = instace._component.props[key];

	let val = instace._vnode.props[key];

	if (isFunction(com)) {
		// 如果他是一个函数就把他包装成一个object 对象
		com = {
			type: com
		};
	}

	if (!isArray(instace._component.props)) {
		if (val.constructor !== com.type.name) {
			val = com.default == undefined ? val : com.default;
			console.warn(
				`当前传递的参数跟子组件的参数类型不一至 ${val.constructor.name} to ${com.type.name}`
			);
		}
	}

	data.props[key] = val;
}

function disposeEvent(props: any, data: any, key: string) {
	data.on[key] = props[key];
}

function disposeArtt(props: any, data: any, key: string) {
	data.attr[key] = props[key];
}

export function updateProps(_install: ComponentInstance) {
	const old = _install.props;

	const newValue = _install._vnode.props!;

	const parameter = getParameter(_install);

	Object.keys(newValue).forEach(key => {
		if (parameter.indexOf(key) !== -1 && old[key] !== newValue[key]) {
			old[key] = newValue[key];
		}
	});
}

// 判断是否要更新组件主要是判断props的值
export function isUpdateComponets(n1: VNode, n2: VNode) {
	if (
		// 2个都不存在不用更新
		(!n2.props && !n1.props) ||
		// n1不存在 n2存在但是他的props是个空对象的也不用更新
		(!n1.props && n2.props && Object.keys(n2.props).length <= 0)
	) {
		return false;
	}

	if (!n1.props && n2.props) {
		return true;
	} else {
		for (let key in n1.props) {
			if (n2.props![key] !== n1.props[key]) {
				return true;
			}
		}
	}

	return false;
}

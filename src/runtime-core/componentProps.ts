import { readonly } from "../reactivity/reactive";
import { extend, isArray, isFunction, isKeyEvent, isObject } from "./../utils/index";

export function initProps(instace: ComponentInstance) {
	// 如果不存在 没必要循环
	if (!instace._vnode.props) return;

	const props = instace._vnode.props;

	const parameter = isArray(instace._component.props)
		? [...instace._component.props]
		: isObject(instace._component.props)
		? Object.keys(instace._component.props)
		: [];

	const data = {
		on: {},
		props: {},
		attr: {}
	};

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

	// 设置为只读对象
	data.props = readonly(data.props);
	extend(instace, data);
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

	if (val.constructor !== com.type.name) {
		val = com.default == undefined ? val : com.default;
		console.warn(
			`当前传递的参数跟子组件的参数类型不一至 ${val.constructor.name} to ${com.type.name}`
		);
	}

	data.props[key] = val;
}

function disposeEvent(props: any, data: any, key: string) {
	data.on[key] = props[key];
}

function disposeArtt(props: any, data: any, key: string) {
	data.attr[key] = props[key];
}
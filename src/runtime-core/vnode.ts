import { isString } from "./../utils/index";
export function createVNode(
	type: Component | string,
	props?: ComponentProps,
	children?: any
): VNode {
	const vnode = {
		type,
		props,
		children,
		el: null,
		key: props?.key,
		_install: null
	};

	return vnode;
}

export function h(type: Component | string, props?: ComponentProps, children?: any) {
	// 如果是组件的话 childrens 可能是undifande
	if (children == undefined && isString(type)) {
		children = props;
		props = undefined;
	}
	return createVNode(type, props, children);
}

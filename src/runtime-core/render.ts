import { effect } from "../reactivity/effect";
import { getEventkey, isArray, isKeyEvent, isObject, isString } from "./../utils/index";
import { createComponentInstall, setupComponent } from "./component";

export function render(vnode: VNode, container: HTMLDivElement, parent?: ComponentInstance) {
	// 这里就是根据不同去挂载不一样的
	patch(null, vnode, container, parent!);
}

// 处理挂载组件的
function patch(n1: null | VNode, n2: VNode, container: HTMLDivElement, parent: ComponentInstance) {
	// 判断他是不是一个组件 如果不是 那就是渲染元素
	if (isObject(n2.type)) {
		processComponent(n1, n2, container, parent);
	} else if (isString(n2.type)) {
		// 处理element类型
		processElements(n1, n2, container, parent);
	}
}

// 组件的处理
function processComponent(
	n1: VNode | null,
	n2: VNode,
	container: HTMLDivElement,
	parent: ComponentInstance
) {
	mountComponent(n2, container, parent);
}

// 挂载组件
function mountComponent(vnode: VNode, container: HTMLDivElement, parent: ComponentInstance) {
	const instace = createComponentInstall(vnode, parent);
	// 初始化 instace对象实例
	setupComponent(instace);
	// 调用render函数进行渲染
	setupRenderEffect(instace, container, instace);
}

// 调用render函数
function setupRenderEffect(
	instace: ComponentInstance,
	container: HTMLDivElement,
	parent: ComponentInstance
) {
	effect(() => {
		const { _ctx } = instace;
		// 说明没挂载
		if (instace._subTree == null) {
			const subTree = (instace._subTree = instace._render!.call(_ctx));
			// render函数重新得到的虚拟dom节点再重新执行 patch函数
			patch(null, subTree, container, parent);
			instace.$el = subTree.el!;
		} else {
			// 旧的虚拟dom
			const _prevSubTree = instace._subTree;
			// 新的虚拟dom
			const subTree = (instace._subTree = instace._render!.call(_ctx));

			patch(_prevSubTree, subTree, container, parent);
		}
	});
}
function processElements(
	n1: null | VNode = null,
	n2: VNode,
	container: HTMLDivElement,
	parent: ComponentInstance
) {
	if (n1 == null) {
		mountElement(n2, container, parent);
	} else {
		// 更新阶段
		patchElement(n1, n2, container, parent);
	}
}

function patchElement(n1: VNode, n2: VNode, container: any, parent: ComponentInstance) {
	patchChildren(n1!, n2, container, parent);

	patchProps(n1, n2);
}

function patchProps(n1: VNode, n2: VNode) {
	let oldProps = n1!.props || {};
	let newProps = n2.props || {};

	let el = (n2.el = n1!.el);

	for (let key in newProps) {
		let value = newProps[key];
		// 如果他们两不一致就修改
		if (oldProps[key] !== value) {
			if (value === undefined || value === null) {
				el?.removeAttribute(key);
			} else {
				el?.setAttribute(key, value);
			}
		}
	}
}

/**
 * @description:
 * 		这个主要是实现虚拟dom的对比 场景1
 *	1.旧的虚拟dom childern  是一个数组 然后新的虚拟dom childern 是一个文本
 *		就要先移除掉旧的虚拟dom 然后把新的dom添加进来Text文本
 *	2.新的虚拟dom childern  是一个数组 然后旧的虚拟dom childern 是一个文本
 *		清空text文本然后 添加新的childenr进来
 *	3.就是文本跟文本的对比直接替换就ok
 *	4.新跟旧的都是数组
 * @param {VNode} n1 旧的虚拟dom
 * @param {VNode} n2 新的虚拟dom
 * @return {*}
 */
function patchChildren(n1: VNode, n2: VNode, container: any, parent: ComponentInstance) {
	// 先把旧的子节点取出来
	const oldChi = n1.children;
	const newChi = n2.children;
	// 这里就是判断的有些草率 因为如果是 Text 文本他肯定是一个字符串,
	// 但是源码中用的是一另一个方法 位运算符的解决方案
	// 场景1
	if (isArray(oldChi) && isString(newChi)) {
		// 移除旧的节点
		unmountChildenr(oldChi);
		// 设置新的文本节点
		setChilderText(n1.el!, newChi);
	} else if (isArray(newChi) && isString(oldChi)) {
		// 将数文本设置为空
		setChilderText(n1.el!, "");
		mountElement(newChi, n1.el!, parent);
	} else if (isString(oldChi) && isString(newChi) && oldChi !== newChi) {
		setChilderText(n1.el!, newChi);
	} else {
		// 就是数组跟数组的对比了
	}
}

function mountElement(vnode: any, container: HTMLDivElement, parent: ComponentInstance) {
	if (isArray(vnode)) {
		vnode?.forEach((vnode: any) => patch(null, vnode, container, parent));
		return;
	}

	let element = document.createElement(vnode.type as string) as HTMLDivElement;
	// 初始化挂载props 挂载子节点
	const { children, props } = vnode as VNode;

	if (isString(children)) {
		// 是不是字符串
		setChilderText(element!, children as unknown as string);
	} else if (isArray(children)) {
		children?.forEach((vnode: any) => patch(null, vnode, element, parent));
	}
	// 挂载属性
	if (isObject(props)) {
		processProps(element, props);
	}
	container.appendChild(element);
	vnode.el = element;
}

// 设置text文本
function setChilderText(el: HTMLDivElement, children: string) {
	el.textContent = children;
}
function processProps(el: HTMLDivElement, props: any) {
	for (let key in props) {
		const v = props[key];
		// 是不是事件
		if (isKeyEvent(key)) {
			createEvent(el, key, v);
		} else {
			// 普通的属性
			createdAttribute(el, key, v);
		}
	}
}

function createdAttribute(el: HTMLDivElement, key: string, value: any) {
	el.setAttribute(key, value);
}

function createEvent(el: HTMLDivElement, key: string, value: any) {
	key = getEventkey(key, true);
	el.addEventListener(key, value);
}

function unmountChildenr(children: any) {
	let fragment = document.createDocumentFragment() as any;

	for (let i = 0; i < children.length; i++) {
		let el = children[i].el;
		fragment.appendChild(el);
	}
}

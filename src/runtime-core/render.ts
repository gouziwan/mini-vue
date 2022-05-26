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
		patchElement(n1, n2, container);
	}
}

function patchElement(n1: VNode | null, n2: VNode, container: any) {
	patchProps(n1, n2);
}

function patchProps(n1: VNode | null, n2: VNode) {
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

function mountElement(vnode: VNode, container: HTMLDivElement, parent: ComponentInstance) {
	let element = document.createElement(vnode.type as string) as HTMLDivElement;
	// 初始化挂载props 挂载子节点
	const { children, props } = vnode;

	if (isString(children)) {
		// 是不是字符串
		createChilderText(element!, children as unknown as string);
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

// 创建text文本
function createChilderText(el: HTMLDivElement, children: string) {
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

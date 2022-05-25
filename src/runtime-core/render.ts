import { getEventkey, isArray, isKeyEvent, isObject, isString } from "./../utils/index";
import { createComponentInstall, setupComponent } from "./component";

export function render(vnode: VNode, container: HTMLDivElement, parent?: ComponentInstance) {
	// 这里就是根据不同去挂载不一样的
	patch(vnode, container, parent!);
}

// 处理挂载组件的
function patch(vnode: VNode, container: HTMLDivElement, parent: ComponentInstance) {
	// 判断他是不是一个组件 如果不是 那就是渲染元素
	if (isObject(vnode.type)) {
		processComponent(vnode, container, parent);
	} else if (isString(vnode.type)) {
		// 处理element类型
		processElements(vnode, container, parent);
	}
}

// 组件的处理
function processComponent(vnode: VNode, container: HTMLDivElement, parent: ComponentInstance) {
	mountComponent(vnode, container, parent);
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
	const { _ctx } = instace;
	const subTree = instace._render!.call(_ctx);
	// render函数重新得到的虚拟dom节点再重新执行 patch函数
	patch(subTree, container, parent);
	instace.$el = subTree.el!;
}
function processElements(vnode: VNode, container: HTMLDivElement, parent: ComponentInstance) {
	mountElement(vnode, container, parent);
}

function mountElement(vnode: VNode, container: HTMLDivElement, parent: ComponentInstance) {
	let element = document.createElement(vnode.type as string) as HTMLDivElement;
	// 初始化挂载props 挂载子节点
	const { children, props } = vnode;

	if (isString(children)) {
		// 是不是字符串
		createChilderText(element!, children as unknown as string);
	} else if (isArray(children)) {
		children?.forEach((vnode: any) => patch(vnode, element, parent));
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

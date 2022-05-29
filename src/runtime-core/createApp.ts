import { render } from "./render";
import { createVNode } from "./vnode";

let instaceMap = [] as ComponentInstance[];

export function createApp(rootComponents: Component) {
	return {
		mount(rootConents: string | HTMLDivElement) {
			const vnode = createVNode(rootComponents);
			// 这个是渲染根组件的
			render(vnode, getElementNode(rootConents), null!, undefined);
			// 执行生命周期
			execInstaceOnMouted();
		}
	};
}

function getElementNode(el: string | HTMLDivElement) {
	if (el instanceof HTMLDivElement) return el;
	let elem = document.querySelector<HTMLDivElement>(el)!;
	return elem;
}

export function addInstaceMap(instace: ComponentInstance) {
	instaceMap.push(instace);
}

export function execInstaceOnMouted() {
	while (instaceMap.length > 0) {
		let instace = instaceMap.pop();
		instace?.mounted!();
	}
}

import { extend, isObject } from "./../utils/index";
import { render } from "./render";
import { createVNode, h } from "./vnode";

let instaceMap = [] as ComponentInstance[];
// 全局注册组件
export let globalComponents = new Map<string, Component>();

export function createApp(rootComponents: Component) {
	return {
		mount(rootConents: string | HTMLDivElement) {
			const vnode = createVNode(rootComponents);
			// 这个是渲染根组件的
			render(vnode, getElementNode(rootConents), null!, undefined);
			// 执行生命周期
			execInstaceOnMouted();
		},
		config: {
			comments: globalComponents
		},
		components: registerComponents,
		use: VueUse
	};
}

function registerComponents(this: CreateApp, key: string, components: Component) {
	globalComponents.set(key, components);

	return this;
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
		instace?.activity.onMounted && instace?.activity.onMounted!();
	}
}

function VueUse(this: CreateApp, value: any) {
	if (value instanceof Function) {
		value(this);
	} else {
		value.install(this);
	}
	return this;
}

// 内置组件
globalComponents.set("components", {
	props: ["is"],
	render() {
		const component = isObject(this.$props.is)
			? this.$props.is
			: globalComponents.get(this.$props.is);

		return h("template", {}, [h(component, this.$attr, this.$slots)]);
	}
});

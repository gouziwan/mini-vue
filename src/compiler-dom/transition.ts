import { extend, isArray, isFunction, isObject } from "./../utils/index";
import { h } from "../runtime-core/vnode";
import { getCurrentInstace } from "../runtime-core/Vue";
import { TagMap } from "../eumn/tag";

import { globalComponents } from "../runtime-core/createApp";

const elementTag = {
	slot: "slot"
} as any;

function createVueInstace(...arg: any) {
	return extend(
		{
			h,
			_createElement,
			_createProps,
			_createChildern,
			_createSlot,
			isComponents
		},
		window,
		...arg
	) as any;
}

// template => render 函数
export function transition(ast: ChildrenNodes): RenderType {
	const currentInstace = getCurrentInstace();

	// 创建一个上下文实例 用于存储信息的
	const VueInstace = createVueInstace();

	let render = function () {
		// 这个函数是执行 ast => render函数的
		return generate.call(VueInstace, currentInstace, ast);
	};

	return render;
}

export function generate(this: any, $vm: ComponentInstance, ast: ChildrenNodes) {
	this.ast = ast;
	this.$vm = $vm;

	const vnode = renderStr.call(
		this,
		`h(_createElement.call(this,ast.tag,$vm),
				_createProps.call(this,ast,$vm), 
				isComponents(ast.tag,$vm) === false ? 
				_createChildern.call(this,ast,$vm) : 
				_createSlot.call(this,ast,$vm))`
	);

	// 这个是执行一个上下文
	return withSlots(vnode, ast, $vm);
}

// 这个创建 返回是一个标签还是一个组件
export function _createElement(tag: string, $vm: ComponentInstance) {
	const { _components } = $vm;
	tag = tag.trim();
	// 是不是标签
	if (TagMap[tag as keyof typeof TagMap] === true) {
		return tag;
	} else if (_components[tag]) {
		return _components[tag];
	} else if (globalComponents.has(tag)) {
		return globalComponents.get(tag);
	} else {
		return tag;
	}
}

function _createProps(this: Ten, ast: ChildrenNodes, $vm: ComponentInstance) {
	let props = {} as { [x: string]: any };

	if (isArray(ast.attrs) && ast.attrs!.length <= 0) return props;

	for (let i = 0; i < ast.attrs!.length; i++) {
		let { name, value } = ast.attrs![i];
		if (name === "v-for") continue;

		// 区分属性还是
		let req = /^\"(.+)\"$/;
		// 普通的属性就是不需要获取变量的
		if (req.test(value)) {
			value = value.replace(req, (a: any, b: any) => b);
			props[name] = value;
		} else {
			props[name] =
				$vm.state[value] != undefined ? $vm.state[value] : renderStr.call(this, `${value}`);
		}
	}

	return props;
}

// 创建 子节点
function _createChildern(this: any, ast: ChildrenNodes, $vm: ComponentInstance) {
	if (!isArray(ast.children)) return [];

	const arr = ast.children
		.map(chi => {
			// 这里可能是一个渲染过的虚拟dom 然后 直接返回不需要任何处理
			if (chi._isVnode) {
				return chi;
			} else if (chi.type === "Text") {
				return renderStr.call(this, `h('',null,${paresText.call(this, chi.children, $vm)})`);
			} else if (chi.type === "Element") {
				this.chi = chi;
				this.isComponents = isComponents;

				const value = isvFor(chi.attrs);

				if (!value) {
					const vnode = renderStr.call(
						this,
						`h(_createElement.call(this,chi.tag,$vm),
				_createProps.call(this,chi,$vm), 
				isComponents(chi.tag,$vm) === false ? 
				_createChildern.call(this,chi,$vm) : 
				_createSlot.call(this,chi,$vm))`
					);
					return withSlots(vnode, chi, $vm);
				} else {
					return realizeInstruction.call(this, value, ast);
				}

				// 如果他是一个插槽的话就把
			}
		})
		.flat();

	return arr;
}

// 把 一个文本的数组给拼起来
function paresText(this: any, chi: any) {
	if (isArray(chi)) {
		return `'${chi
			.map((str: any) => {
				return isObject(str) ? getValue.call(this, str.value) : str;
			})
			.join("")}'`;
	} else {
		return chi;
	}
}

// 这个是创建上下文的
function renderStr(this: any, code: string, isCall: Boolean = true) {
	if (isCall) return new Function(`with(this){return ${code}}`).call(this);

	return new Function(`with(this){return ${code} }`).bind(this);
}

// 插槽
function _createSlot(this: any, ast: ChildrenNodes, $vm: any) {
	if (!ast.children || ast.children.length <= 0) return {};

	let slot = {} as any;

	for (let i = 0; i < ast.children.length; i++) {
		let chi = ast.children[i];
		let name = chi.slot == undefined ? "default" : chi.slot;

		slot[name] = withSlots(null, chi, $vm);
	}

	for (let key in slot) {
		let s = slot[key];

		// 如果直接用他们会共享同一个 实例我们需要把继承
		const VueInstace = createVueInstace(this, {
			ast: s,
			$vm
		});

		slot[key] = renderStr.call(
			VueInstace,
			`h(_createElement.call(this,ast.tag,$vm),_createProps.call(this,ast,$vm),_createChildern.call(this,ast,$vm))`,
			false
		);
	}

	return slot;
}

// 判断是不是组件 isComponents
function isComponents(tag: string, $vm: ComponentInstance) {
	return !!($vm._components && $vm._components[tag]);
}

// 处理slot
function withSlots(vnode: any, chi: any, $vm: ComponentInstance): VNode {
	if (!elementTag[chi.tag]) return vnode || chi;

	if (!vnode) {
		vnode = chi;
		vnode.tag = `template`;
	} else {
		vnode.type = `template`;
	}

	for (let key = 0; key < chi.attrs.length; key++) {
		let k = chi.attrs[key];

		if (k.name === "v-slot") {
			let children = $vm.$slots[k.value.replace(/\"/g, "")];

			if (isFunction(children)) {
				children = children();
			}
			vnode.children = isArray(children) ? children : [children];

			chi.attrs.splice(key, 1);

			return vnode;
		}
	}

	if ($vm.$slots["default"]) {
		let children = $vm.$slots["default"];

		if (children == undefined) return vnode;

		if (isFunction(children)) {
			children = children();
		}

		vnode.children = isArray(children) ? children : [children];
	}
	return vnode;
}

// 判断有没用 v-for这种改变数据结构的
function isvFor(attrs: any) {
	if (!isArray(attrs) && attrs.length <= 0) return false;

	for (let i = 0; i < attrs.length; i++) {
		const value = attrs[i];
		if (value.name === "v-for") {
			return attrs[i];
		}
	}
}

// v-for实现
function realizeInstruction(this: any, value: any, ast: any) {
	let val = value.value.replace(/^\"|\"$/g, "");
	let req = /(.+)? in (.+)/;

	let arr = val.match(req);

	// 取出第一个列表就是item -> index
	let item = arr[1];

	item =
		item.indexOf(",") === -1
			? [item]
			: item.split(",").map((el: string) => el.replace(/\(|\)/g, ""));

	const [keys, i] = item;

	const data = getValue.call(this, arr[2]);

	if (isArray(data)) {
		const arr = data.map((el: any, index: number) => {
			this[keys] = el;
			this[i] = index;

			return renderStr.call(
				this,
				`h(_createElement.call(this,chi.tag,$vm),
				_createProps.call(this,chi,$vm), 
				isComponents(chi.tag,$vm) === false ? 
				_createChildern.call(this,chi,$vm) : 
				_createSlot.call(this,chi,$vm))`
			);
		});

		return arr;
	}

	return [];
}

function getValue(this: any, value: string) {
	return this.$vm.state[value] != undefined
		? this.$vm.state[value]
		: renderStr.call(this, `${value}`);
}

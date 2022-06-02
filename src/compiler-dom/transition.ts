import { extend, isArray, isObject } from "./../utils/index";
import { h } from "../runtime-core/vnode";
import { getCurrentInstace } from "../runtime-core";

// template => render 函数
export function transition(ast: ChildrenNodes): RenderType {
	const currentInstace = getCurrentInstace();

	// 创建一个上下文实例 用于存储信息的
	const VueInstace = extend(
		{
			h,
			_createElement,
			_createProps,
			_createChildern,
			_createSlot
		},
		window
	) as any;

	let render = function () {
		// 这个函数是执行 ast => render函数的
		return generate.call(VueInstace, currentInstace, ast);
	};

	return render;
}

export function generate(this: any, $vm: ComponentInstance, ast: ChildrenNodes) {
	this.ast = ast;
	this.$vm = $vm;
	// 这个是执行一个上下文
	return renderStr.call(
		this,
		`h(_createElement.call(this,ast.tag,$vm),_createProps,_createChildern.call(this,ast,$vm))`
	);
}

// 这个创建 返回是一个标签还是一个组件
export function _createElement(tag: string, $vm: ComponentInstance) {
	const { _components } = $vm;
	if (_components && _components[tag]) {
		return _components[tag];
	} else {
		return tag;
	}
}

function _createProps(ast: ChildrenNodes, $vm: ComponentInstance) {
	let props = {};
}

// 创建 子节点
function _createChildern(this: any, ast: ChildrenNodes, $vm: ComponentInstance) {
	return ast.children.map(chi => {
		if (chi.type === "Text") {
			return renderStr.call(this, `h('',null,${paresText(chi.children, $vm)})`);
		} else if (chi.type === "Element") {
			this.chi = chi;
			this.isComponents = isComponents;

			console.log($vm);

			return renderStr.call(
				this,
				`h(_createElement.call(this,chi.tag,$vm),
				_createProps, 
				isComponents(chi.tag,$vm) === false ? 
				_createChildern.call(this,chi,$vm) : 
				_createSlot.call(this,chi,$vm))`
			);
		}
	});
}

// 把 一个文本的数组给拼起来
function paresText(chi: any, $vm: ComponentInstance) {
	if (isArray(chi)) {
		return `'${chi.map((str: any) => (isObject(str) ? $vm.state[str.value] : str)).join("")}'`;
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
function _createSlot(this: any, ast: ChildrenNodes) {
	if (!ast.children || ast.children.length <= 0) return {};

	let slot = {} as any;

	for (let i = 0; i < ast.children.length; i++) {
		let chi = ast.children[i];

		let name = chi.slot == undefined ? "default" : chi.slot;

		if (!isArray(slot[name])) {
			slot[name] = [];
		}
		slot[name].push(chi);
	}

	console.log(slot);

	return slot;
}

// 判断是不是组件 isComponents
function isComponents(tag: string, $vm: ComponentInstance) {
	return !!$vm._components && $vm._components[tag];
}

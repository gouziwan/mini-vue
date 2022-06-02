import { effect } from "../reactivity/effect";
import { getSequence } from "../utils/getSequence";
import { addQueue } from "../utils/queue";
import { getEventkey, isArray, isKeyEvent, isObject, isString } from "./../utils/index";
import { createComponentInstall, setupComponent } from "./component";
import { updateProps, isUpdateComponets } from "./componentProps";

export function render(
	vnode: VNode,
	container: HTMLDivElement,
	anchor: HTMLDivElement,
	parent?: ComponentInstance
) {
	// 这里就是根据不同去挂载不一样的
	patch(null, vnode, container, parent!, anchor);
}

// 处理挂载组件的
function patch(
	n1: null | VNode,
	n2: VNode,
	container: HTMLDivElement,
	parent: ComponentInstance,
	anchor: HTMLDivElement
) {
	// 判断他是不是一个组件 如果不是 那就是渲染元素
	if (isObject(n2.type)) {
		processComponent(n1, n2, container, parent, anchor);
	} else if (isString(n2.type)) {
		// 处理element类型
		processElements(n1, n2, container, parent, anchor);
	}
}

// 组件的处理
function processComponent(
	n1: VNode | null,
	n2: VNode,
	container: HTMLDivElement,
	parent: ComponentInstance,
	anchor: HTMLDivElement
) {
	if (!n1) {
		mountComponent(n2, container, parent, anchor);
	} else {
		updateComponent(n1, n2);
	}
}

// 挂载组件
function mountComponent(
	vnode: VNode,
	container: HTMLDivElement,
	parent: ComponentInstance,
	anchor: HTMLDivElement
) {
	const instace = (vnode._install = createComponentInstall(vnode, parent));
	// 初始化 instace对象实例
	setupComponent(instace);
	// 调用render函数进行渲染
	setupRenderEffect(instace, container, instace, anchor);
}

// 调用render函数
function setupRenderEffect(
	instace: ComponentInstance,
	container: HTMLDivElement,
	parent: ComponentInstance,
	anchor: HTMLDivElement
) {
	instace.updatedComponent = effect(
		() => {
			const { _ctx } = instace;
			// 说明没挂载
			if (instace._subTree == null) {
				const subTree = (instace._subTree = instace._render!.call(_ctx));
				// 执行
				instace.activity.onBeforeMountd && instace.activity.onBeforeMountd();
				// render函数重新得到的虚拟dom节点再重新执行 patch函数
				patch(null, subTree, container, parent, anchor);
				instace.$el = subTree.el!;
			} else {
				// 旧的虚拟dom
				const _prevSubTree = instace._subTree;
				// 新的虚拟dom
				const subTree = (instace._subTree = instace._render!.call(_ctx));

				patch(_prevSubTree, subTree, container, parent, anchor);

				instace.activity?.onUpdated && instace.activity?.onUpdated();
			}
		},
		{
			scheduler() {
				addQueue(instace);
			}
		}
	);
}

function updateComponent(n1: VNode, n2: VNode) {
	n2._install = n1._install;

	if (isUpdateComponets(n1, n2)) {
		const { _install } = n2;
		_install!._vnode = n2;
		updateProps(_install!);
		// 这里主要是更新
		_install?.updatedComponent();
	}
}

function processElements(
	n1: null | VNode = null,
	n2: VNode,
	container: HTMLDivElement,
	parent: ComponentInstance,
	anchor: HTMLDivElement
) {
	if (n1 == null) {
		mountElement(n2, container, parent, anchor);
	} else {
		// 更新阶段
		patchElement(n1, n2, parent);
	}
}

function patchElement(n1: VNode, n2: VNode, parent: ComponentInstance) {
	patchChildren(n1!, n2, parent);
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
function patchChildren(n1: VNode, n2: VNode, parent: ComponentInstance) {
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
		n1.el!.innerHTML = "";
		mountElement(newChi, n1.el!, parent, null!);
	} else if (isString(oldChi) && isString(newChi)) {
		if (oldChi !== newChi) {
			updateChilderText(n1.el!, newChi);
		}
	} else {
		// 就是数组跟数组的对比了
		patchArrayChildren(oldChi, newChi, n1.el!, parent);
	}
}

function patchArrayChildren(
	chi1: any,
	chi2: any,
	container: HTMLDivElement,
	parent: ComponentInstance
) {
	// debugger;
	// 当前索引主要是指向左边对比
	let index = 0;
	// 旧的节点长度
	let len1 = chi1.length - 1;
	// 新的节点长度
	let len2 = chi2.length - 1;

	// 首先是左侧对比先判断是否相等
	while (index <= len1 && index <= len2) {
		let n1 = chi1[index];
		let n2 = chi2[index];

		if (isNodesAreEqual(n1, n2)) {
			n2.el = n1.el;
			patch(n1, n2, container, parent, null!);
		} else {
			// 跳出循环当找不到不相同的时候
			break;
		}
		index++;
	}

	// 往后找 看下后面是否匹配
	while (index <= len1 && index <= len2) {
		let n1 = chi1[len1],
			n2 = chi2[len2];

		if (isNodesAreEqual(n1, n2)) {
			n2.el = n1.el;
			patch(n1, n2, container, parent, null!);
		} else {
			break;
		}

		len1--;
		len2--;
	}

	// 就是多余添加的情况就是新的比老的还长 那么 index 肯定大于 len1的
	if (index > len1) {
		// 说明此时需要添加节点
		if (index <= len2) {
			let next = len2 + 1;
			// 这个下一个值 如果index == 0
			let node = next < chi2.length ? chi2[next].el : null;

			while (index <= len2) {
				let n2 = chi2[index];
				patch(null, n2, container, parent, node);
				index++;
			}
		}
	} else if (index > len2) {
		// 删除逻辑
		// 删除那是不是就是删除 index -> len1 这个区间的dom 就可以了?
		if (index <= len1) {
			unmountChildenr(chi1.slice(index, len1 + 1));
		}
	} else {
		let s2 = index;
		// 用于存储出现过的虚拟dom
		let map = new Map();
		let toBePatched = len2 - s2 + 1;
		// 判断是否需要 移动 怎么判断呢 ->
		// 如果是一个最长递增子序列的话 他的数组的值 肯定是一个 -> 1 , 2 , 5 ,7 ->这种的 后一个值肯定比前一个值大
		let mover = false;
		// 记录
		let max = 0;
		// 节约长度
		const newIndexToOldIndexMap = new Array(toBePatched);
		// 初始化为 0 0代表创建的节点
		newIndexToOldIndexMap.fill(0);
		// 遍历新的节点 -> 把他的节点给缓存下来
		for (let i = index; i <= len2; i++) {
			let key = chi2[i].key;
			map.set(key, i);
		}
		let currentIndex = null;
		// 遍历新的节点查看有没有存在老的节点
		for (let i = index; i <= len1; i++) {
			let key = chi1[i].key;
			// 如果有那就设置
			currentIndex = map.get(key);
			if (currentIndex != undefined) {
				// 这个是记录节点的用户找到我们中的最长递增子序列
				// 这里i + 1 -> 是一个特殊的关系的 如果他为 0 那么 他就是 需要创建的节点
				if (currentIndex >= max) {
					max = currentIndex;
				} else {
					mover = true;
				}
				newIndexToOldIndexMap[currentIndex - s2] = i + 1;
				patch(chi1[i], chi2[currentIndex], container, parent, null!);
			} else {
				unmountChildenr([chi1[i]]);
				continue;
			}
		}

		// 生成 最长递增子序列
		// mover 主要是用于优化他的子序列 如果 都不需要移动的时候就执行这个函数
		const increasingNewIndexSequence = mover ? getSequence(newIndexToOldIndexMap) : [];

		let j = increasingNewIndexSequence.length - 1;

		for (let i = toBePatched - 1; i >= 0; i--) {
			const next = i + s2;
			const nextChid = chi2[next].el;
			// 这个是锚点 就是 当前的节点下一个节点 他可能是 null -> 就是往后面插入
			const anchor = next + 1 <= chi2.length - 1 ? chi2[next + 1].el : null;
			if (newIndexToOldIndexMap[i] === 0) {
				patch(null, chi2[next], container, parent, anchor);
			} else {
				// 如果当前的 i 不等于最长递增子序列的值的话 -> 就说明当前的节点是需要去移动的
				if (i !== increasingNewIndexSequence[j]) {
					insert(nextChid, container, anchor);
				} else {
					// 不需要去移动
					// 指针--
					j--;
				}
			}
		}
	}
}

function isNodesAreEqual(n1: VNode, n2: VNode) {
	return n1.type === n2.type && n1.key === n2.key;
}

function mountElement(
	vnode: any,
	container: HTMLDivElement,
	parent: ComponentInstance,
	anchor: HTMLDivElement
) {
	if (isArray(vnode)) {
		vnode?.forEach((vnode: any) => patch(null, vnode, container, parent, anchor));
		return;
	}

	const { type, children, props } = vnode as VNode;

	if (type === "" && isString(children)) {
		vnode.el = setChilderText(container, children);
		return;
	}

	let element = document.createElement(type as string) as HTMLDivElement;
	// 初始化挂载props 挂载子节点

	if (isString(children)) {
		// 是不是字符串
		vnode.el = setChilderText(element!, children as unknown as string);
	} else if (isArray(children)) {
		children?.forEach((vnode: any) => patch(null, vnode, element, parent, anchor));
	}
	// 挂载属性
	if (isObject(props)) {
		processProps(element, props);
	}
	insert(element, container, anchor);
	vnode.el = element;
}

// 设置text文本
function setChilderText(el: HTMLDivElement, children: string) {
	const txtNode = document.createTextNode(children);
	el.appendChild(txtNode);
	return txtNode;
}

function updateChilderText(el: any, children: string) {
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
	fragment = null;
}

function insert(children: HTMLDivElement, parent: HTMLDivElement, anchor: null | HTMLDivElement) {
	parent.insertBefore(children, anchor);
}

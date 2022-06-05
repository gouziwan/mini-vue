import { ref } from "../reactivity/ref";
import { h } from "../runtime-core/Vue/Vue/Vue";

//1.左侧对比
// const prevChildren = [
// 	h("li", { key: "A" }, "A"),
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "C" }, "C")
// ];

// const nextChildren = [
// 	h("li", { key: "A" }, "A"),
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "C" }, "C"),
// 	h("li", { key: "D" }, "D")
// ];

// // 2.右侧对比
// const prevChildren = [
// 	h("li", { key: "A" }, "A"),
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "C" }, "C")
// ];

// const nextChildren = [
// 	h("li", { key: "F" }, "F"),
// 	h("li", { key: "E" }, "E"),
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "C" }, "C")
// ];

// 3. 新的比老的长 增加 左侧 相同
// const prevChildren = [
// 	h("li", { key: "A" }, "A"),
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "C" }, "C")
// ];

// const nextChildren = [
// 	h("li", { key: "A" }, "A"),
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "C" }, "C"),
// 	h("li", { key: "F" }, "F"),
// 	h("li", { key: "E" }, "E")
// ];

// 3. 新的比老的长 增加 右侧 相同
// const prevChildren = [h("li", { key: "B" }, "B"), h("li", { key: "C" }, "C")];

// const nextChildren = [
// 	h("li", { key: "G" }, "G"),
// 	h("li", { key: "K" }, "K"),
// 	h("li", { key: "E" }, "E"),
// 	h("li", { key: "F" }, "F"),
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "C" }, "C")
// ];

// 4. 老的比新的长 左侧 删除节点
// const prevChildren = [
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "C" }, "C"),
// 	h("li", { key: "F" }, "F"),
// 	h("li", { key: "E" }, "E"),
// 	h("li", { key: "F" }, "F"),
// 	h("li", { key: "E" }, "E")
// ];

// const nextChildren = [h("li", { key: "B" }, "B"), h("li", { key: "C" }, "C")];

// 5. 老的比新的长 右侧 删除节点
// const prevChildren = [
// 	h("li", { key: "A" }, "B"),
// 	h("li", { key: "B" }, "A"),
// 	h("li", { key: "E" }, "E"),
// 	h("li", { key: "F" }, "F"),
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "C" }, "C")
// ];

// const nextChildren = [h("li", { key: "B" }, "B"), h("li", { key: "C" }, "C")];

/**
 *  6.对比中间的部分
 *  删除老的节点 在老的存在 新的不存在
 *  D节点在老的时候存在 新的不存在
 * 	c节点新老都存在 c的位置改变  删除
 */
// const prevChildren = [
// 	h("li", { key: "A" }, "B"),
// 	h("li", { key: "B" }, "A"),
// 	h("li", { key: "Z" }, "Z"),
// 	h("li", { key: "C", class: "old-class" }, "C"),
// 	h("li", { key: "D" }, "D"),
// 	h("li", { key: "E" }, "E"),
// 	h("li", { key: "F" }, "F")
// ];

// const nextChildren = [
// 	h("li", { key: "A" }, "B"),
// 	h("li", { key: "B" }, "A"),
// 	h("li", { key: "G" }, "G"),
// 	h("li", { key: "C", class: "new-class" }, "修改的C"),
// 	h("li", { key: "E" }, "E"),
// 	h("li", { key: "F" }, "F")
// ];

// 只移动 双端对比
// const prevChildren = [
// 	h("li", { key: "A" }, "A"),
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "C" }, "C"),
// 	h("li", { key: "D" }, "D"),
// 	h("li", { key: "E" }, "E"),
// 	h("li", { key: "F" }, "F"),
// 	h("li", { key: "G" }, "G")
// ];

// const nextChildren = [
// 	h("li", { key: "A" }, "A"),
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "E" }, "E"),
// 	h("li", { key: "C" }, "C"),
// 	h("li", { key: "D" }, "D"),
// 	h("li", { key: "F" }, "F"),
// 	h("li", { key: "G" }, "G")
// ];

// const prevChildren = [
// 	h("li", { key: "A" }, "A"),
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "C" }, "C"),
// 	h("li", { key: "E" }, "E"),
// 	h("li", { key: "F" }, "F"),
// 	h("li", { key: "G" }, "G")
// ];

// const nextChildren = [
// 	h("li", { key: "A" }, "A"),
// 	h("li", { key: "B" }, "B"),
// 	h("li", { key: "E" }, "E"),
// 	h("li", { key: "C" }, "C"),
// 	h("li", { key: "D" }, "D"),
// 	h("li", { key: "F" }, "F"),
// 	h("li", { key: "G" }, "G")
// ];

const prevChildren = [
	h("li", { key: "A", class: "A" }, "A"),
	h("li", { key: "B" }, "B"),
	h("li", { key: "C" }, "C"),
	h("li", { key: "G", class: "G" }, "G")
];

const nextChildren = [
	h("li", { key: "A", class: "AA" }, "A"),
	h("li", { key: "C" }, "C"),
	h("li", { key: "B" }, "B"),
	h("li", { key: "G", class: "GG" }, "G")
];

export const AppList: Component = {
	name: "AppList",
	setup() {
		const isValue = (window.ref = ref(false));

		return {
			isValue
		};
	},

	render() {
		return h(
			"div",
			{
				class: "chid"
			},
			this.isValue === true ? nextChildren : prevChildren
		);
	}
};

export const App: Component = {
	name: "App",
	render() {
		return h("div", {}, [h("p", {}, this.msg), h(AppList)]);
	},
	setup() {
		return {
			msg: "主页"
		};
	}
};

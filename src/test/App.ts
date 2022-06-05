import Foo from "../component/Foo";
import { ref } from "../reactivity/ref";
import { h, provide, inject } from "../runtime-core/Vue/Vue/Vue";

const ArrayList: Component = {
	name: "ArrayList",

	setup() {
		let arr = inject("arr", []);

		return {
			arr
		};
	},

	render() {
		return h(
			"div",
			{
				class: "chid"
			},
			this.arr.map((el: string) => h("li", {}, el))
		);
	}
};

const ArrayChilder: Component = {
	name: "ArrayChilder",
	setup() {
		const isValue = (window.ref = ref(true));

		const arr = new Array(10).fill("").map((el, index) => `列表${index + 1}`);

		provide("arr", arr);

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
			this.isValue === true ? "newChilder" : "换一个文本看看"
		);
	}
};

const AppChiled: Component = {
	render() {
		return h("div", {}, [h(ArrayChilder)]);
	}
};

export const App: Component = {
	name: "App",
	render() {
		return h("div", {}, [h("p", {}, this.msg), h(AppChiled, {})]);
	},
	setup() {
		return {
			msg: "主页"
		};
	}
};

import Foo from "./component/Foo";
import { ref } from "./reactivity/ref";
import { h, inject, provide } from "./runtime-core";

export const App: Component = {
	name: "App",
	render() {
		return h(
			"div",
			{
				bar: this.data.bar,
				foo: this.data.foo
			},
			[
				h("p", {}, "count:" + this.count),
				h("button", { onClick: this.onClick }, "点击添加"),
				h("button", { onClick: this.upFoo }, "修改foo"),
				h("button", { onClick: this.upFooisNull }, "将foo修改为null"),
				h("button", { onClick: this.removeBar }, "将bar移除")
			]
		);
	},
	setup() {
		const count = ref(0);

		const data = ref({
			bar: "bar",
			foo: "foo"
		});

		const upFoo = () => (data.value.foo = "new-foo");

		const upFooisNull = () => (data.value.foo = null);

		const removeBar = () => (data.value = []);

		const onClick = () => {
			count.value = ++count.value;
		};
		return {
			count,
			onClick,
			data,
			upFoo,
			upFooisNull,
			removeBar
		};
	}
};

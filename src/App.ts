import { useRouter } from "./routers/createrRouter";
import { getCurrentInstace, h, inject, provide, ref, watchEffect } from "./runtime-core/Vue";

export const App: Component = {
	name: "App",
	setup() {
		const router = useRouter() as any;

		const msg = (window.s = ref("哈哈哈"));

		const name = (window.vs = ref("App组件的作用域"));

		provide("name", name);

		const onClickToRouter = () => {
			router.push("index");
		};

		return {
			msg: msg,
			onClickToRouter
		};
	},
	template: `
		<div id="App">
			<router-view></router-view>
			<button @click="onClickToRouter">点击跳转到指定页面</button>
        </div>
	`,
	component: {}
};

export const AppChiren: Component = {
	render() {
		return h("div", {}, [this.$slots.default({ name: "插槽中自组件参数传递给父组件" })]);
	}
};

export const Apps: Component = {
	name: "Apps",
	setup() {
		const msg = (window.s = ref("hello"));

		const boolean = (window.sw = ref(false));

		const onClick = () => {
			console.log(msg);
		};

		return {
			msg: msg,
			boolean,
			onClick
		};
	},
	render() {
		return h("div", {}, [
			h(
				"div",
				{
					onClick: this.onClick
				},
				"666"
			),
			h(
				AppChiren,
				{},
				{
					default: (props: any) => {
						return h("div", {}, props.name);
					}
				}
			)
		]);
	}
};

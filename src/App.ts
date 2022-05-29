import { ref } from "./reactivity/ref";
import { h } from "./runtime-core/index";
const App: Component = {
	name: "App",
	setup() {
		const msg = ref("App消息");

		const onClick = () => {
			msg.value = "更新后的App消息";
		};

		const count = ref(0);

		const onClickAdd = () => {
			++count.value;
		};

		return {
			msg,
			onClick,
			count,
			onClickAdd
		};
	},
	render() {
		return h("div", {}, [
			h(Childern, { msg: this.msg }),
			h(
				"button",
				{
					onClick: this.onClick
				},
				"点击更新子组件"
			),
			h(
				"button",
				{
					onClick: this.onClickAdd
				},
				"点击count++"
			),
			h("p", {}, `${this.count}`)
		]);
	}
};

const Childern: Component = {
	name: "Childern",
	props: ["msg"],
	render() {
		console.log(1);
		return h("div", {}, `hello world - childer msg ->${this.$props.msg}`);
	}
};

export { App };

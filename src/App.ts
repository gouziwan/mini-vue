import { ref } from "./reactivity/ref";
import {
	h,
	getCurrentInstace,
	onBeforeUpdate,
	onUpdated,
	onBeforeMountd
} from "./runtime-core/index";
const App: Component = {
	name: "App",
	setup() {
		const msg = ref("App消息");

		const instace = getCurrentInstace();

		const onClick = () => {
			msg.value = "更新后的App消息";
		};

		const count = ref(0);

		const onClickAdd = () => {
			++count.value;
		};

		const nums = ref(0);

		const onClickNums = () => {
			for (let i = 0; i < 99; i++) {
				nums.value = i;
			}
		};

		onBeforeMountd(() => {
			console.log(`组件即将挂载但是`, instace.state.msg, document.querySelector(".nums"));
		});

		onBeforeUpdate(() => {
			console.log(`组件即将更新的值`, msg.value, document.querySelector(".nums")?.innerHTML);
		});

		onUpdated(() => {
			console.log(`组件更新后的值`, instace.state.msg, document.querySelector(".nums")?.innerHTML);
		});

		return {
			msg,
			onClick,
			count,
			onClickAdd,
			onClickNums,
			nums
		};
	},
	render() {
		return h("div", {}, [
			h(Childern, { msg: this.msg, count: this.count }),
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
			h("p", {}, `${this.count}`),
			h(
				"button",
				{
					onClick: this.onClickNums
				},
				"nums++"
			),
			h("p", { class: "nums" }, `${this.nums}`)
		]);
	}
};

const Childern: Component = {
	name: "Childern",
	props: ["msg"],
	render() {
		return h(
			"div",
			{
				count: this.$attr.count
			},
			`hello world - childer msg ->${this.$props.msg}`
		);
	}
};

export { App };

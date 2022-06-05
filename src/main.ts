import { App, Apps } from "./App";
import { createApp } from "./runtime-core/Vue";

const app = createApp(App);

app.components("MyButton", {
	props: ["name"],

	setup(props) {
		return {
			onClick: () => {
				console.log(`点击测试`);
			},
			name: props.name
		};
	},

	template: `
        <button @click="onClick">
            一个简单的dom 接受一个测试 属性 => {{ name }}
        </button>
        `
});

// console.log(app);

app.components("MyTree", {
	name: "MyTree",
	template: `
        <div>切换组件的情况 当前组件 MyTree</div>
    `
});

app.mount("#app");

createApp(Apps).mount("#txt");

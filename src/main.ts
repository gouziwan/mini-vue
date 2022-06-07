import { App, Apps } from "./App";
import { createApp, onBeforeUninstall, ref, watchEffect } from "./runtime-core/Vue";

import { routers } from "./router";

const app = createApp(App);

app.components("MyButton", {
	props: ["count"],

	setup(props) {
		onBeforeUninstall(() => {
			console.log(`组件将要卸载了此时dom还是可以获取的`, document.querySelector("#button"));
		});

		const count = ref(0);

		return {
			onClick: () => {
				console.log(`点击测试`);
			},
			count
		};
	},

	template: `
        <button @click="onClick" id="button"> 
            一个简单的dom 接受一个测试 属性 => {{ count }}
        </button>
        `
});

app.components("MyTree", {
	name: "MyTree",
	template: `
        <div>切换组件的情况 当前组件 MyTree</div>
    `
});

app.use(routers);

app.mount("#app");

createApp(Apps).mount("#txt");

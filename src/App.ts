import { ref } from "./reactivity/ref";

export const App: Component = {
	name: "App",
	setup() {
		const msg = (window.s = ref("哈哈哈"));

		return {
			msg: msg
		};
	},
	template: `
        <div>
            <MyInput>
                <template #name>
                    <div>我是插槽name</div>
                </template>
            </MyInput>
            今天天气真好 {{ msg }}
        </div>
    `,
	component: {
		MyInput: {
			name: "MyInput",

			setup() {
				const txt = (window.txt = ref("修改信息"));

				return {
					txt
				};
			},

			template: `
                <div>
                    <div>我是MyInput组件 => {{ txt }}</div>
                    <slot v-slot="name"></slot>
                </div>
            `
		},
		name: "MyInput"
	}
};

// import { ref } from "./reactivity/ref";
// import { h } from "./runtime-core";

// export const App: Component = {
// 	name: "App",
// 	setup() {
// 		const msg = (window.s = ref("hello"));

// 		const boolean = (window.sw = ref(false));

// 		return {
// 			msg: msg,
// 			boolean
// 		};
// 	},
// 	render() {
// 		return h("div", {}, [h("", {}, this.msg), h("div", {}, "66")]);
// 	}
// };

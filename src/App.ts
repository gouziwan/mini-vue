import { ref } from "./reactivity/ref";

import { provide, inject } from "./runtime-core/injecct";

export const App: Component = {
	name: "App",
	setup() {
		const msg = (window.s = ref("哈哈哈"));

		const name = (window.vs = ref("App组件的作用域"));

		provide("name", name);

		return {
			msg: msg,
			name
		};
	},
	template: `
        <div>
            <MyInput name="123">
                <div data="data"> 
					我是默认插槽 
				</div>
				<template #name>
				 	<div>我是插槽 {{ name }} </div> 
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

				const name = inject("name");

				const data = ref(`子组件传的msg`);

				return {
					txt,
					name,
					data
				};
			},

			template: `
                <div>
                    <div>我是MyInput组件 => {{ txt }}</div>
					<MyChildren>
						<slot v-slot="name"></slot>
					</MyChildren>
					<slot></slot>
                </div>
            `,
			component: {
				MyChildren: {
					name: "MyChildren",
					setup() {
						return {};
					},
					template: `
					<div name="my-children">
						<slot>

						</slot>	
					</div>
				`
				}
			}
		}
	}
};

import { ref } from "./reactivity/ref";

import { h } from "./runtime-core";

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

		return {
			msg: msg,
			boolean
		};
	},
	render() {
		return h("div", {}, [
			h("div", {}, "666"),
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

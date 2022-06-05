import { getCurrentInstace, h, inject, provide, ref, watchEffect } from "./runtime-core/Vue";

export const App: Component = {
	name: "App",
	setup() {
		const msg = (window.s = ref("哈哈哈"));

		const name = (window.vs = ref("App组件的作用域"));

		provide("name", name);

		const count = ref(0);

		const App = "app";

		const onClick = () => {
			count.value++;
		};

		const components = ref("MyButton");

		function onSwiper() {
			components.value = "MyTree";
		}

		window.ref = onSwiper;

		return {
			msg: msg,
			name,
			App,
			count,
			onClick,
			components,
			onSwiper
		};
	},
	template: `
		<div id="App" :class="App" :index-value="count">
			<MyInput :age="count">
					<div>我是默认插槽</div>
					<template #name>
						<div>我是插槽{{ name }}</div> 
					</template>
				</MyInput>
				今天天气真好 {{ msg }}
				<button @click="onClick">
					按钮事件
				</button>
				<div>
					{{ count }}
				</div>
				<div style="margin-top:100px">
					<h2>新的测试全局组件</h2>	
					<p>
						<button @click="onSwiper">点击切换组件</button>
					</p>
					<components :is="components" :name="msg" />
				</div>
        </div>
	`,
	component: {
		MyInput: {
			name: "MyInput",
			props: ["age"],
			setup(props) {
				const instace = getCurrentInstace();

				const txt = (window.txt = ref("修改信息"));

				const name = inject("name");

				const data = ref(`子组件传的msg`);

				const count = ref(0);

				watchEffect(() => {
					count.value = props.age;
				});

				const onClick = () => {
					props.age++;
				};

				return {
					txt,
					name,
					data,
					count,
					onClick
				};
			},

			template: `
                <div>
                    <div>我是MyInput组件 => {{ txt }}</div>
					<MyChildren>
						<slot v-slot="name"></slot>
					</MyChildren>
					<slot></slot>
					<div @click="onClick">
						计数器:=> {{ count }}
					</div>
                </div>
            `,
			component: {
				MyChildren: {
					name: "MyChildren",
					setup() {
						return {};
					},
					template: `
					<div>
						<slot>
							<div>如果没有插槽则单独显示这个插槽</div>
						</slot>	
					</div>
				`
				}
			}
		}
	}
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

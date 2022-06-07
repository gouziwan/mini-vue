import { getCurrentInstace, h, inject, provide, ref, watchEffect } from "./runtime-core/Vue";

export const App: Component = {
	name: "App",
	setup() {
		const msg = (window.s = ref("哈哈哈"));

		const name = (window.vs = ref("App组件的作用域"));

		provide("name", name);

		const list = ref(["A", "B", "C", "D", "E"]);

		const onClick = function () {
			list.value.push("F");
		};

		return {
			msg: msg,
			list,
			onClick
		};
	},
	template: `
		<div id="App">
			<p v-for="(item,index) in list" :key="index">
				{{ item }}
			</p>
			<button @click="onClick">点击添加新增数据</button>
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

import { useRoute, useRouter } from "./routers/createrRouter";
import { inject, provide, ref, computed, watchEffect } from "./runtime-core/Vue";

export const AppChilend: Component = {
	setup() {
		const data = inject("key", 3);

		return { data };
	},
	template: `
		<div class="childend" :index-value="data">
			<slot>
				<div>
					默认插槽默认值
				</div>
			</slot>
			<slot name="name">
				<div>这是name 插槽的默认值</div>
			</slot>
			<slot name="age">
				<div>这是age 插槽的默认值</div>
			</slot>
		</div>
	`
};

export const App: Component = {
	setup() {
		provide("key", 123);

		const keys = (window.keys = ref(true));

		const className = computed(() => {
			return keys.value == true ? "name" : "age";
		});

		const router = useRouter();

		const route = useRoute();

		const indexPath = ref("/index?abc=123");

		const homePath = ref("/?home=132");

		const onClickSweiper = () => {
			console.log(route);
		};

		return {
			AppChilend,
			keys,
			className,
			onClickSweiper,
			indexPath,
			homePath
		};
	},

	template: `
		<div class="name">
			<AppChilend>
				<template>
					<div :class="className.value">
						传递
					</div>
				</template>
			</AppChilend>
			<components :is="AppChilend">
				<div #name>这是hello 插槽</div>
				<div #age>age插槽</div>
			</components>
			<router-view></router-view>
			<button @click="onClickSweiper">
				hello
			</button>
			<router-like :to="indexPath">
				<div>
					跳转到index页面
				</div>
			</router-like>
			<router-like :to="homePath">
				<div>
					跳转到Home页面
				</div>
			</router-like>
		
		</div>
	`,
	component: {
		AppChilend: AppChilend
	}
};
